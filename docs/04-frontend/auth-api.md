# Auth 前端对接文档

> 本文档面向前端开发者，包含登录流程、OAuth2 协议端点和 JWT Token 结构。

## 概述

kbpd-auth 是 OAuth2 认证授权中心，前端主要对接：

1. **登录页面**：用户输入凭证，获取授权码
2. **Token 端点**：用授权码或密码换取 Access Token
3. **JWT Token**：携带 Token 访问业务接口

---

## 页面接口

基础路径：`/oauth2`

### GET /oauth2/login — 登录页面

渲染登录表单。通过 `client_id` 查询客户端配置，获取对应的 `tenantId` 和 `userType` 注入到表单隐藏域。

**请求参数**：

| 参数        | 类型   | 必填 | 说明                                           |
| ----------- | ------ | ---- | ---------------------------------------------- |
| `client_id` | String | 否   | OAuth2 客户端 ID，用于确定租户和用户类型上下文 |

**响应**：

- 成功：渲染 `login.html`，Model 包含 `tenantId`、`userType`、`clientId`
- 客户端不存在：渲染 `error.html`，显示错误信息

**表单提交**：

登录表单 POST 提交至 `/login`（Spring Security 默认处理），包含以下字段：

| 字段       | 类型   | 说明                                   |
| ---------- | ------ | -------------------------------------- |
| `username` | String | 用户名                                 |
| `password` | String | 密码                                   |
| `tenantId` | String | 租户 ID（隐藏域）                      |
| `userType` | String | 用户类型（隐藏域，如 `TO_B` / `TO_C`） |
| `clientId` | String | 客户端 ID（隐藏域）                    |

### GET /oauth2/consent — 授权确认页面

用户在 Authorization Code 流程中确认授权范围。展示请求的 Scope 列表，区分"待批准"和"已批准"。

**请求参数**：

| 参数        | 类型   | 必填 | 说明                       |
| ----------- | ------ | ---- | -------------------------- |
| `client_id` | String | 是   | OAuth2 客户端 ID           |
| `scope`     | String | 是   | 请求的授权范围（空格分隔） |
| `state`     | String | 是   | 防 CSRF 状态值             |

**响应**：

- 成功：渲染 `consent.html`，展示待批准和已批准的 Scope 列表
- 未认证：重定向到登录页

**已定义的 Scope 描述**：

| Scope           | 描述                     |
| --------------- | ------------------------ |
| `profile`       | 查看您的基本个人信息     |
| `message.read`  | 读取您的消息             |
| `message.write` | 发送消息                 |
| 其他            | `Unknown scope: {scope}` |

**表单提交**：

授权确认表单 POST 提交至 `/oauth2/authorize`，包含勾选的 Scope 和 `state`。

### GET /oauth2/error — 错误页面

渲染认证错误信息。

**响应**：渲染 `error.html`，Model 包含 `errorTitle` 和 `errorMessage`。

---

## OAuth2 协议端点

由 Spring Authorization Server 框架自动注册，使用默认路径前缀 `/oauth2`。

### POST /oauth2/token — Token 端点

OAuth2 标准令牌签发端点。

**支持的 Grant Type**：

| Grant Type           | 说明                                 |
| -------------------- | ------------------------------------ |
| `authorization_code` | 授权码模式（推荐）                   |
| `refresh_token`      | 刷新令牌                             |
| `client_credentials` | 客户端凭证模式（需 Client 配置支持） |
| `password` \*        | 资源所有者密码模式（自定义扩展）     |

> \*密码模式通过自定义的 `TenantAwareAuthenticationFilter` + `CustomerAuthenticationProvider` 实现，非 Spring Authorization Server 内置支持。

**客户端认证方式**：

- `client_secret_basic`（HTTP Basic Auth）
- `client_secret_post`（请求体携带 client_id / client_secret）

**成功响应**：

根据客户端类型返回不同格式：

**工具类客户端**（`tool-client-id` 配置列表中的 Client ID，如 `local`）：

返回标准 OAuth2 Token Response：

```json
{
  "access_token": "eyJhbGciOiJ...",
  "refresh_token": "vKjH...",
  "token_type": "Bearer",
  "expires_in": 43200
}
```

**普通客户端**：

返回包裹在 `JsonResult` 中的响应：

```json
{
  "code": "0",
  "msg": "success",
  "data": {
    "access_token": "eyJhbGciOiJ...",
    "refresh_token": "vKjH...",
    "token_type": "Bearer",
    "expires_in": 43200
  }
}
```

**失败响应**：

```json
{
  "code": "{OAuth2 错误码}",
  "msg": "{错误描述}",
  "data": null
}
```

### GET /oauth2/authorize — 授权端点

OAuth2 标准授权端点，启动 Authorization Code 流程。

**请求参数**：

| 参数            | 类型   | 必填     | 说明                       |
| --------------- | ------ | -------- | -------------------------- |
| `response_type` | String | 是       | 固定值 `code`              |
| `client_id`     | String | 是       | 客户端 ID                  |
| `scope`         | String | 否       | 请求的授权范围（空格分隔） |
| `redirect_uri`  | String | 条件必填 | 回调地址                   |
| `state`         | String | 推荐     | 防 CSRF                    |

**流程**：

1. 未认证用户 → 重定向到 `/oauth2/login?client_id={clientId}`
2. 已认证 + 需要用户确认 → 重定向到 `/oauth2/consent`
3. 已认证 + 自动批准 → 302 重定向到 `redirect_uri?code={authorizationCode}&state={state}`

### GET /oauth2/jwks — JWK Set 端点

公开 JWT 签名公钥，供 Resource Server 验证 Token。

**响应**：标准 JWK Set JSON。

### POST /oauth2/introspect — Token 内省端点

RFC 7662 Token Introspection。

### POST /oauth2/revoke — Token 撤销端点

RFC 7009 Token Revocation。

---

## JWT Token 结构

### Access Token (JWT)

**Header**：

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload — B 端用户**：

```json
{
  "sub": "admin",
  "aud": ["{client_id}"],
  "iss": "https://localhost:8600/auth",
  "exp": 1714022400,
  "iat": 1713979200,
  "jti": "{token_id}",
  "userId": 1,
  "username": "admin",
  "groupId": 1,
  "authorities": ["ROLE_ADMIN", "sys:user:list"]
}
```

**Payload — C 端会员**：

```json
{
  "sub": "member01",
  "aud": ["{client_id}"],
  "iss": "https://localhost:8600/auth",
  "exp": 1714022400,
  "iat": 1713979200,
  "jti": "{token_id}",
  "memberId": 1
}
```

### Token 有效期

| Token 类型         | 默认有效期 | 配置项                                     |
| ------------------ | ---------- | ------------------------------------------ |
| Access Token       | 12 小时    | `kbpd.auth.access-token-validity-seconds`  |
| Refresh Token      | 30 天      | `kbpd.auth.refresh-token-validity-seconds` |
| Authorization Code | 5 分钟     | 框架默认                                   |
