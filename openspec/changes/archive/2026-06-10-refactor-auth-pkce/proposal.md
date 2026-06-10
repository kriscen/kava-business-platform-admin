## Why

后端文档已更新为 OAuth2 Authorization Code + PKCE 流程，但前端代码仍停留在旧实现：缺少 PKCE 参数、state 不验证、JWT claims 结构未对齐、token 存储策略存在 XSS 风险。需要将前端 auth 实现与最新后端文档对齐。

## Scope

### Non-Goals

- 不改变 Mock 模式的登录方式（保持用户名密码表单）
- 不新增 consent 页面（后端自动批准 internal scope）
- 不实现 token 撤销（revoke）的前端调用（可选功能，后续再加）

## What Changes

- **新增 PKCE 工具函数**：生成 `code_verifier`、`code_challenge`（S256）、`state`
- **改造 OAuth2 授权流程**：authorize URL 加入 `code_challenge` + `code_challenge_method`，token exchange 加入 `code_verifier`，Content-Type 改为 `form-urlencoded`
- **state 验证**：callback 页面验证 state 参数防止 CSRF
- **JWT claims 对齐**：解析新的 payload 结构（`roles` 替代 `authorities`，新增 `tenantId`、`userType`、`dataScope`）
- **token 存储策略调整**：`access_token` 存 `sessionStorage`，`refresh_token` 存 `localStorage`，页面加载时支持静默刷新
- **scope 修正**：从 `read` 改为 `internal`
- **响应格式适配**：普通客户端的 token 响应包裹在 `JsonResult` 中，需要正确解析
- **refresh token 请求补全**：加入 `client_id` 参数
- **登录页改造**：真实模式下只显示登录按钮跳转 Auth 服务，mock 模式保持现有表单
- **环境配置修正**：`.env.development` 的 redirect_uri 端口从 5173 改为 3000
- **Mock 数据同步**：JWT payload 结构对齐新 claims

## Capabilities

### New Capabilities

- `pkce-flow`: PKCE 参数生成与管理（code_verifier、code_challenge、state）

### Modified Capabilities

- `auth-system`: OAuth2 授权流程加入 PKCE、state 验证、token 存储策略调整、JWT claims 对齐、scope 修正、响应格式适配

## Approach

将 PKCE 工具函数独立为 `src/utils/pkce.ts` 模块，与 auth 逻辑解耦。Token 存储采用分层策略：access_token 存 sessionStorage（关闭 tab 自动清除，XSS 窗口有限），refresh_token 存 localStorage（关闭 tab 后重新打开可静默恢复）。state 参数编码 `{role}:{random}` 格式，callback 时验证前缀确定角色、验证随机部分防 CSRF。Token exchange 保持 raw fetch 方式但修正 Content-Type 为 form-urlencoded，正确解析 JsonResult 包裹的响应。登录页在真实模式下简化为单按钮跳转，Mock 模式保持现有表单不变。

## Impact

- **src/utils/pkce.ts**（新增）：PKCE 工具函数
- **src/api/auth.ts**：token exchange 和 refresh 的请求格式与响应解析
- **src/stores/authStore.ts**：登录流程、token 存储、JWT 解析、静默刷新
- **src/pages/oauth-callback/OAuthCallbackPage.tsx**：state 验证、PKCE 参数传递
- **src/pages/login/PlatformLoginPage.tsx**、**TenantLoginPage.tsx**：真实模式简化
- **.env.development**：redirect_uri 端口修正
- **mock/auth.ts**：JWT payload 结构同步
- **docs/04-frontend/auth-guide.md**：scope 示例修正为 `internal`
