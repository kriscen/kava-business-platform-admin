## Context

Kava Admin 后台管理系统需要用户认证能力。目前系统无登录功能，所有用户直接访问 `/dashboard`。本设计为登录功能的技术实现方案。

## Goals / Non-Goals

**Goals:**

- 实现平台管理员和租户管理员的统一登录页
- 支持 Mock 模式和真实 OAuth2 模式切换
- Token 自动刷新，登录状态持久化
- 基于角色的动态菜单渲染

**Non-Goals:**

- 不实现后端 OAuth2 服务（仅前端跳转和回调处理）
- 不实现权限细粒度控制（仅区分平台管理员/租户管理员两种角色）
- 不实现登录页的国际化（后续独立处理）

## Decisions

### 1. 路由结构

```
App.tsx
├── /login              → LoginPage (独立布局，无 AdminLayout)
├── /oauth/callback     → OAuthCallbackPage (独立布局)
└── /dashboard          → AdminLayout (需登录)
    ├── /dashboard      → Dashboard
    └── /system/users   → UserManagement (仅平台管理员可见)
```

**Why**: 登录页必须独立于 AdminLayout，否则会出现侧边栏闪动。OAuth 回调页也需独立布局。

### 2. 登录页设计

```tsx
// LoginPage.tsx
- Tab 切换：平台管理员 / 租户管理员
- 平台管理员：账号 + 密码
- 租户管理员：账号 + 密码 + 租户编码
- 根据环境变量 VITE_ENABLE_MOCK 切换 Mock/OAuth2 模式
```

### 3. Mock JWT 结构

```json
{
  "sub": "user_id",
  "role": "platform_admin",
  "username": "admin",
  "exp": 1234567890
}
```

Mock 模式下直接使用 `jsonwebtoken` 生成（仅开发环境使用）。

### 4. Token 存储

| Key                  | 内容                           | 说明         |
| -------------------- | ------------------------------ | ------------ |
| `auth_access_token`  | access_token                   | API 请求携带 |
| `auth_refresh_token` | refresh_token                  | 刷新 token   |
| `auth_user_info`     | { role, username, tenantCode } | 用户信息     |

### 5. API 拦截器修改

```ts
// interceptors.ts
- 请求拦截器：从 localStorage 读取 access_token，添加到 Authorization header
- 响应拦截器：捕获 401，尝试用 refresh_token 刷新，重试原请求
- 刷新失败：清除所有 auth_*，跳转到登录页
```

### 6. OAuth2 流程（MOCK=false）

```
1. LoginPage → window.location.href = 构建 OAuth2 URL
2. 后端授权页 → 用户授权 → redirect_uri?code=xxx
3. OAuthCallbackPage → 调用 /oauth2/token { code, grant_type: "authorization_code" }
4. 存储 token → 跳转 /dashboard
```

### 7. Auth Store (Zustand)

```ts
interface AuthState {
  isAuthenticated: boolean
  userInfo: { role: string; username: string; tenantCode?: string } | null
  accessToken: string | null
  refreshToken: string | null
}

interface AuthActions {
  login: (credentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}
```

## Risks / Trade-offs

| Risk                             | Mitigation                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| Mock JWT 被误用于生产            | VITE_ENABLE_MOCK 仅在 .env.development 设为 true，.env.staging/.env.production 不设置 |
| Token 刷新时多个并发请求同时 401 | 使用请求队列，刷新 token 时阻塞其他请求                                               |
| OAuth2 redirect_uri 配置错误     | 在 .env 中统一配置 VITE_OAUTH_REDIRECT_URI                                            |

## Open Questions

1. **OAuth2 client_id** - 需要后端提供 client_id，当前使用占位值
2. **Mock JWT 过期时间** - access_token 设为 15 分钟，refresh_token 设为 7 天
3. **后端权限字段** - JWT 中的权限/角色字段名待确认，当前假设为 `role`
