# 登录集成指南

> 本文档面向前端开发者，提供从零开始对接 Kava 认证系统的完整步骤。

## 概述

Kava 使用 OAuth2 协议进行认证。当前阶段支持**密码模式（Password Grant）**，前端直接向 Auth 服务换取 Token。

```
┌──────────┐     POST /auth/oauth2/token      ┌──────────┐
│  前端 SPA │ ──── (username + password) ────→ │ Auth 服务 │
│          │ ←─── access_token + refresh_token ──│          │
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

每个前端应用对应一个 OAuth2 Client，由后端在 `sys_oauth_client_details` 表中配置。需要向后端获取：

| 参数            | 说明                             | 示例         |
| --------------- | -------------------------------- | ------------ |
| `client_id`     | 客户端 ID                        | `kava-admin` |
| `client_secret` | 客户端密钥                       | `secret`     |
| `user_type`     | 用户类型（隐含在 Client 配置中） | B端=1，C端=2 |

> `client_id` 决定了登录用户的类型和归属租户，前端不需要传递 `user_type` 和 `tenantId`。

## Step 2：获取 Token

### 请求

```
POST http://{gateway}:8500/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic {base64(client_id:client_secret)}
```

请求体（form-urlencoded）：

| 参数         | 值               | 说明     |
| ------------ | ---------------- | -------- |
| `grant_type` | `password`       | 密码模式 |
| `username`   | 用户输入的用户名 |          |
| `password`   | 用户输入的密码   |          |

**客户端认证方式**（二选一）：

- `client_secret_basic`：在 `Authorization` Header 中用 Basic Auth 传递 `client_id:client_secret`
- `client_secret_post`：在请求体中额外传递 `client_id` 和 `client_secret` 参数

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

## Step 3：存储 Token

| Token           | 推荐存储位置                 | 说明                       |
| --------------- | ---------------------------- | -------------------------- |
| `access_token`  | 内存变量 或 `sessionStorage` | 有效期 12 小时，频繁使用   |
| `refresh_token` | `localStorage`               | 有效期 30 天，仅刷新时使用 |

> 避免将 `access_token` 存入 `localStorage`（易受 XSS 攻击）。内存变量最安全，但刷新页面后丢失；`sessionStorage` 是折中方案。

## Step 4：携带 Token 请求业务接口

所有业务接口需在请求头中携带 Token：

```
GET http://{gateway}:8500/upms/api/v1/sys/user/page?pageNo=1&pageSize=10
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

## Step 5：Token 刷新

当 `access_token` 过期时，用 `refresh_token` 获取新的 Token，无需用户重新登录。

### 请求

```
POST http://{gateway}:8500/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic {base64(client_id:client_secret)}
```

| 参数            | 值                       |
| --------------- | ------------------------ |
| `grant_type`    | `refresh_token`          |
| `refresh_token` | 之前保存的 refresh_token |

### 响应

与获取 Token 的成功响应格式相同，返回新的 `access_token` 和 `refresh_token`。

> 刷新后旧的 `refresh_token` 失效，务必用新的替换。

## Step 6：登出

### 清除本地 Token

前端清除内存/sessionStorage/localStorage 中的所有 Token。

### 撤销 Token（可选）

```
POST http://{gateway}:8500/auth/oauth2/revoke
Content-Type: application/x-www-form-urlencoded
Authorization: Basic {base64(client_id:client_secret)}

token={access_token}
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

| Token 类型    | 默认有效期 | 说明             |
| ------------- | ---------- | ---------------- |
| Access Token  | 12 小时    | 过期后需刷新     |
| Refresh Token | 30 天      | 过期后需重新登录 |

## 前端登录流程总结

```
用户输入用户名密码
       │
       ▼
POST /auth/oauth2/token (grant_type=password)
       │
       ├── 成功 → 存储 access_token + refresh_token → 进入主页
       │
       └── 失败 → 显示 errorMessage
                   ├── "Bad credentials" → 用户名或密码错误
                   ├── "User account is locked" → 账号已锁定
                   └── 其他 → 联系管理员

使用中 access_token 过期
       │
       ▼
POST /auth/oauth2/token (grant_type=refresh_token)
       │
       ├── 成功 → 替换 Token → 重试原请求
       │
       └── 失败 → refresh_token 也过期 → 跳转登录页
```
