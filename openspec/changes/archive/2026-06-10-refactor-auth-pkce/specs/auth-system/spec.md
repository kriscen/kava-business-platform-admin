## MODIFIED Requirements

### Requirement: OAuth2 授权码模式

系统 SHALL 支持 OAuth2 Authorization Code + PKCE 模式，真实环境下跳转到后端授权页进行登录。scope MUST 为 `internal`。

#### Scenario: 跳转 OAuth2 授权页

- **WHEN** 用户在登录页点击"登录"（Mock 环境除外）
- **THEN** 系统生成 PKCE 参数（code_verifier、code_challenge、state），将 code_verifier 和 state 存入 sessionStorage，跳转到 `/oauth2/authorize?client_id=xxx&redirect_uri=xxx&response_type=code&scope=internal&code_challenge=xxx&code_challenge_method=S256&state=xxx`

#### Scenario: OAuth2 回调处理

- **WHEN** 用户在 OAuth2 授权页完成授权后，浏览器被 redirect 到 `/oauth/callback?code=xxx&state=xxx`
- **THEN** 系统验证 state 参数与 sessionStorage 中存储的值匹配，用 code + sessionStorage 中的 code_verifier 调用 `POST /oauth2/token` 换取 access_token 和 refresh_token，解析 JWT payload 提取用户信息，存储 token 后跳转到对应角色的 dashboard

#### Scenario: state 验证失败

- **WHEN** 回调 URL 中的 state 参数与 sessionStorage 中的值不匹配
- **THEN** 系统中止认证流程，显示错误信息

### Requirement: Token 刷新

系统 SHALL 支持 access_token 过期后使用 refresh_token 自动刷新，刷新请求 MUST 使用 raw fetch（不经过 Axios 拦截器）以避免循环调用。刷新请求 MUST 包含 `client_id` 参数。

#### Scenario: access_token 过期自动刷新

- **WHEN** API 请求返回 401
- **THEN** 拦截器使用 raw fetch 调用 `POST /oauth2/token` with `grant_type=refresh_token&client_id=xxx&refresh_token=xxx`（Content-Type: application/x-www-form-urlencoded），成功后更新 authStore 中的 token 并重试原请求

#### Scenario: 并发请求时 token 刷新队列

- **WHEN** 多个请求同时收到 401
- **THEN** 仅第一个请求触发刷新，其余请求排队等待刷新完成后使用新 token 重试

#### Scenario: refresh_token 也过期

- **WHEN** 刷新 token 请求返回非 200
- **THEN** 系统展示 `toast.info('登录已过期，请重新登录')`，清除本地登录状态，跳转到登录页

### Requirement: 登录状态持久化

系统 SHALL 将 access_token 存入 sessionStorage，refresh_token 存入 localStorage。页面加载时 SHALL 支持静默刷新：若 sessionStorage 无 access_token 但 localStorage 有 refresh_token，则自动刷新获取新 access_token。

#### Scenario: 刷新页面后保持登录

- **WHEN** 用户已登录后刷新页面
- **THEN** 系统从 sessionStorage 恢复 access_token，或从 localStorage 用 refresh_token 静默刷新获取新 access_token，继续保持登录状态

#### Scenario: 关闭 tab 后重新打开

- **WHEN** 用户关闭 tab 后重新打开应用
- **THEN** sessionStorage 已清除（无 access_token），系统检查 localStorage 的 refresh_token，若有则静默刷新恢复登录状态，若无则跳转登录页

#### Scenario: authStore 不再暴露 refreshAccessToken 方法

- **WHEN** 检查 authStore 的公开 API
- **THEN** 不存在 `refreshAccessToken` 方法，所有 token 刷新逻辑由拦截器内部处理

### Requirement: 登出

系统 SHALL 提供登出功能，清除 sessionStorage 和 localStorage 中的登录状态并跳转到登录页。

#### Scenario: 用户点击登出

- **WHEN** 用户点击 Header 中的"登出"按钮
- **THEN** 系统清除 sessionStorage 和 localStorage 中的 token 和用户信息，跳转到登录页

### Requirement: JWT Claims 解析

系统 SHALL 按以下结构解析 JWT payload：`roles`（角色编码数组）、`tenantId`、`userType`（"1"=B端，"2"=C端）、`userId`、`username`、`groupId`、`dataScope`。`roles` 仅包含角色编码，不含细粒度权限标识。

#### Scenario: 解析 B 端用户 JWT

- **WHEN** 收到 access_token 的 JWT payload 包含 `userType: "1"`
- **THEN** 系统提取 `roles`、`tenantId`、`userId`、`username`、`groupId`、`dataScope` 存入 userInfo

#### Scenario: 按 userType 跳转对应 dashboard

- **WHEN** JWT payload 的 `userType` 为 `"1"`
- **THEN** 跳转到 `/platform/dashboard`

### Requirement: Token Exchange 请求格式

Token exchange 请求 MUST 使用 `Content-Type: application/x-www-form-urlencoded`，请求体为 form-encoded 格式。普通客户端的响应包裹在 `{ success, data, errorCode, errorMessage }` 结构中，需正确解析。

#### Scenario: 成功换取 Token（普通客户端）

- **WHEN** POST `/oauth2/token` 返回 `{ success: true, data: { access_token, refresh_token, token_type, expires_in } }`
- **THEN** 系统正确提取 `data` 中的 token 字段

#### Scenario: Token Exchange 失败

- **WHEN** POST `/oauth2/token` 返回 `{ success: false, errorCode: "invalid_grant", errorMessage: "Bad credentials" }`
- **THEN** 系统显示错误信息
