## Why

Kava Admin 后台管理系统需要用户认证能力。平台管理员和租户管理员通过统一登录页接入系统，登录成功后根据角色动态渲染菜单。

## What Changes

- 新增独立登录页（不在 AdminLayout 内），支持 Tab 切换平台管理员 / 租户管理员
- Mock 模式：固定账号密码 `123456`，租户管理员额外需租户编码 `DEMO`
- 真实环境：OAuth2 授权码模式，跳转 `/oauth2/authorize` 获取授权码，调用 `/oauth2/token` 获取 access_token + refresh_token
- JWT payload 包含 `role` (platform_admin/tenant_admin) 和 `tenantCode`
- access_token 过期时自动用 refresh_token 刷新
- 登录状态持久化到 localStorage，API 请求拦截器自动携带 Bearer token
- 登录成功后跳转到 `/dashboard`

## Capabilities

### New Capabilities

- `user-auth`: 用户认证（登录、登出、Token 管理、OAuth2 授权回调）
- `role-based-menu`: 基于角色的动态菜单渲染

### Modified Capabilities

<!-- 无现有 spec 修改 -->

## Impact

- 新增页面：`/login`, `/oauth/callback`
- 新增 Store：`authStore`（认证状态、Token 管理）
- 修改 `App.tsx` 路由结构：登录页独立于 AdminLayout
- 修改 `src/api/interceptors.ts`：添加 Token 刷新逻辑
- 新增 `src/pages/LoginPage.tsx`
- 新增 `src/pages/OAuthCallbackPage.tsx`
