# 登录集成指南

> 本文档面向前端开发者，提供从零开始对接 Kava 认证系统的完整步骤。

## 概述

Kava 使用 **OAuth2 Authorization Code + PKCE** 模式进行认证。前端 SPA 作为 Public Client，不需要 `client_secret`，通过 PKCE 保证授权码交换的安全性。

```
┌──────────┐                                    ┌──────────┐
│  前端 SPA │ ── GET /auth/oauth2/authorize ──→ │ Auth 服务 │
│          │ ←── 302 → Auth 登录页 ────────────│          │
│          │                                    │          │
│          │    用户在登录页输入凭证               │          │
│          │                                    │          │
│          │ ←── 302 redirect_uri?code=xxx ────│          │
│          │                                    └──────────┘
│          │     POST /auth/oauth2/token
│          │ ── (code + code_verifier) ──────→ ┌──────────┐
│          │ ←── access_token + refresh_token ──│ Auth 服务 │
└──────────┘                                    └──────────┘
     │
     │  Authorization: Bearer <access_token>
     ▼
┌──────────┐
│ Gateway  │ ──→ UPMS / Member（JWT 校验 + 业务处理）
│  :8500   │
└──────────┘
```

## Step 1：确定 Client 配置

每个前端应用对应一个 OAuth2 Client，由后端在 `sys_oauth_client` 表中配置。需要向后端获取：

| 参数           | 说明                             | 示例                             |
| -------------- | -------------------------------- | -------------------------------- |
| `client_id`    | 客户端 ID                        | `kava-admin`                     |
| `redirect_uri` | 授权回调地址                     | `http://localhost:3000/callback` |
| `user_type`    | 用户类型（隐含在 Client 配置中） | B端=1，C端=2                     |

> `client_id` 决定了登录用户的类型和归属租户，前端不需要传递 `user_type` 和 `tenantId`。
> **Public Client 不需要 `client_secret`**，PKCE 替代了客户端密钥的安全保障。

> **CORS 跨域**：Gateway 已配置全局 CORS 策略，前端 SPA 跨域调用 Token 端点无需额外处理。开发环境允许 `localhost:*`，生产环境需在 Gateway Nacos 配置中添加实际域名。

## Step 2：生成 PKCE 参数

在发起授权请求前，前端需要生成 PKCE 参数：

```javascript
// 1. 生成 code_verifier（43-128 位的随机字符串）
function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

// 2. 从 code_verifier 派生 code_challenge
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(digest))
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// 3. 生成 state（防 CSRF，编码角色信息）
// 格式: {role}:{random}，如 "platform_admin:a8f3k2..."
function generateState(role) {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return `${role}:${base64UrlEncode(array)}`
}
```

> **重要**：`code_verifier` 必须保存在内存中（不能存 URL），后续换 Token 时需要。

## Step 3：发起授权请求（重定向到 Auth 服务）

将用户浏览器重定向到授权端点：

```
GET http://{gateway}:8500/auth/oauth2/authorize
```

| 参数                    | 值                                 | 说明               |
| ----------------------- | ---------------------------------- | ------------------ |
| `client_id`             | `kava-admin`                       | 客户端 ID          |
| `response_type`         | `code`                             | 授权码模式         |
| `redirect_uri`          | `http://localhost:3000/callback`   | 必须与注册的一致   |
| `code_challenge`        | Step 2 生成的值                    | PKCE 挑战码        |
| `code_challenge_method` | `S256`                             | 固定使用 S256      |
| `scope`                 | `internal`                         | 申请的权限范围     |
| `state`                 | Step 2 生成的 `{role}:{random}` 值 | 防 CSRF + 角色标识 |

### 示例 URL

```
https://{gateway}:8500/auth/oauth2/authorize?client_id=kava-admin&response_type=code&redirect_uri=http://localhost:3000/callback&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&scope=internal&state=abc123
```

## Step 4：用户在 Auth 服务登录页认证

浏览器重定向后，用户在 Auth 服务托管的登录页面输入用户名和密码。认证成功后，Auth 服务 302 重定向回前端：

```
HTTP/1.1 302 Found
Location: http://localhost:3000/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=abc123
```

### 前端处理回调

```javascript
// 在 callback 页面中
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const state = urlParams.get('state')

// 验证 state 匹配
if (state !== savedState) {
  // state 不匹配，中止认证！
  throw new Error('State mismatch - possible CSRF attack')
}

// 用 code + code_verifier 换取 Token
exchangeToken(code, savedCodeVerifier)
```

## Step 5：用授权码 + PKCE 换取 Token

### 请求

```
POST http://{gateway}:8500/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded
```

请求体（form-urlencoded）：

| 参数            | 值                   | 说明           |
| --------------- | -------------------- | -------------- |
| `grant_type`    | `authorization_code` | 授权码模式     |
| `code`          | 回调收到的授权码     |                |
| `redirect_uri`  | 与 Step 3 一致       |                |
| `client_id`     | `kava-admin`         | 在请求体中传递 |
| `code_verifier` | Step 2 生成的原始值  | PKCE 验证      |

> **Public Client 不需要 `Authorization` Header 或 `client_secret`**，仅通过 `client_id` + `code_verifier` 完成交换。

### 响应

**成功**（工具类客户端，如 `local`）：

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "vKjH9mN...",
  "token_type": "Bearer",
  "expires_in": 43200
}
```

**成功**（普通客户端，响应包裹在 `JsonResult` 中）：

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "vKjH9mN...",
    "token_type": "Bearer",
    "expires_in": 43200
  },
  "errorCode": null,
  "errorMessage": null
}
```

**失败**：

```json
{
  "success": false,
  "data": null,
  "errorCode": "invalid_grant",
  "errorMessage": "Bad credentials"
}
```

## Step 6：存储 Token

| Token           | 推荐存储位置                 | 说明                       |
| --------------- | ---------------------------- | -------------------------- |
| `access_token`  | 内存变量 或 `sessionStorage` | 有效期 12 小时，频繁使用   |
| `refresh_token` | `localStorage`               | 有效期 30 天，仅刷新时使用 |

> 避免将 `access_token` 存入 `localStorage`（易受 XSS 攻击）。内存变量最安全，但刷新页面后丢失；`sessionStorage` 是折中方案。

## Step 7：携带 Token 请求业务接口

所有业务接口需在请求头中携带 Token：

```
GET http://{gateway}:8500/upms/api/v1/sys/user/page?pageNo=1&pageSize=10
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

## Token 刷新

当 `access_token` 过期时，用 `refresh_token` 获取新的 Token，无需用户重新走授权流程。

### 请求

```
POST http://{gateway}:8500/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded
```

| 参数            | 值                       |
| --------------- | ------------------------ |
| `grant_type`    | `refresh_token`          |
| `refresh_token` | 之前保存的 refresh_token |
| `client_id`     | `kava-admin`             |

### 响应

与获取 Token 的成功响应格式相同，返回新的 `access_token` 和 `refresh_token`。

> 刷新后旧的 `refresh_token` 失效，务必用新的替换。

## 登出

### 清除本地 Token

前端清除内存/sessionStorage/localStorage 中的所有 Token。

### 撤销 Token（可选）

```
POST http://{gateway}:8500/auth/oauth2/revoke
Content-Type: application/x-www-form-urlencoded

token={access_token}&client_id=kava-admin
```

## JWT Token 结构

获取到的 `access_token` 是 JWT 格式，可解码查看 Payload。

### B 端用户 Payload

```json
{
  "sub": "admin",
  "aud": ["kava-admin"],
  "iss": "https://localhost:8600/auth",
  "exp": 1714022400,
  "iat": 1713979200,
  "jti": "token-uuid",
  "tenantId": "1000001",
  "userType": "1",
  "userId": "1",
  "username": "admin",
  "groupId": "1",
  "roles": ["ROLE_ADMIN"],
  "dataScope": "0"
}
```

### C 端会员 Payload

```json
{
  "sub": "member01",
  "aud": ["kava-app"],
  "iss": "https://localhost:8600/auth",
  "exp": 1714022400,
  "iat": 1713979200,
  "jti": "token-uuid",
  "tenantId": "1000001",
  "userType": "2",
  "memberId": "1",
  "roles": []
}
```

### Claims 说明

| Claim       | 类型     | 说明                                           |
| ----------- | -------- | ---------------------------------------------- |
| `sub`       | String   | 用户名                                         |
| `tenantId`  | String   | 租户 ID                                        |
| `userType`  | String   | 用户类型（`"1"` = B端，`"2"` = C端）           |
| `userId`    | String   | B端用户 ID                                     |
| `username`  | String   | B端登录名                                      |
| `groupId`   | String   | B端所属分组 ID                                 |
| `roles`     | String[] | 角色编码列表（仅角色代码，不含细粒度权限标识） |
| `dataScope` | String   | 数据权限范围（"0"=全部，"4"=仅本人）           |
| `memberId`  | String   | C端会员 ID                                     |

> **注意**：`roles` 字段只包含角色编码（如 `ROLE_ADMIN`），不包含细粒度权限标识（如 `sys:user:list`）。按钮级权限需通过 `GET /menu/tree` 接口的 `permission` 字段获取。

### Token 有效期

| Token 类型    | 默认有效期 | 说明                                 |
| ------------- | ---------- | ------------------------------------ |
| Access Token  | 12 小时    | 过期后需刷新                         |
| Refresh Token | 30 天      | 过期后需重新走 Auth Code + PKCE 流程 |

## 前端登录流程总结

```
用户点击"登录"
       │
       ▼
生成 PKCE 参数 (code_verifier, code_challenge, state)
       │
       ▼
重定向到 GET /auth/oauth2/authorize?...&code_challenge=xxx
       │
       ▼
用户在 Auth 服务登录页输入凭证
       │
       ├── 认证失败 → 显示错误信息
       │
       └── 认证成功 → 302 回调到 redirect_uri?code=xxx&state=xxx
              │
              ▼
         验证 state 匹配
              │
              ├── state 不匹配 → 中止，报错
              │
              └── state 匹配 → POST /auth/oauth2/token
                     │       (code + code_verifier + client_id)
                     │
                     ├── 成功 → 存储 Token → 进入主页
                     │
                     └── 失败 → 显示错误信息

使用中 access_token 过期
       │
       ▼
POST /auth/oauth2/token (grant_type=refresh_token)
       │
       ├── 成功 → 替换 Token → 重试原请求
       │
       └── 失败 → refresh_token 过期 → 重新发起 Auth Code + PKCE 流程
```
