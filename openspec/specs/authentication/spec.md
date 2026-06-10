# Authentication Spec

## Purpose

用户认证系统，包含平台/租户分角色登录页、OAuth2 授权码模式、PKCE 参数生成、Token 刷新、登录状态持久化、登出功能，以及 Mock 系统的认证端点。

## Requirements

### Requirement: 平台管理员登录页

系统 SHALL 提供 `/platform/login` 专用登录页，包含用户名和密码字段。Mock 模式下验证账号 `admin` / 密码 `123456`。

#### Scenario: 平台登录页渲染

- **WHEN** 用户导航到 `/platform/login`
- **THEN** 渲染包含用户名和密码字段的登录表单

#### Scenario: 平台管理员登录成功

- **WHEN** 用户在登录页选择"平台管理员" Tab，输入账号 `admin` 和密码 `123456`
- **THEN** 系统验证通过后，存储 mock JWT 到 localStorage，跳转到 `/platform/dashboard`

#### Scenario: 平台管理员登录失败

- **WHEN** 用户输入错误的密码
- **THEN** 系统显示错误提示"账号或密码错误"

### Requirement: 租户管理员登录页

系统 SHALL 提供 `/tenant/login` 专用登录页，包含用户名、密码和租户编码字段。Mock 模式下验证账号 `tenant` / 密码 `123456` / 租户编码 `DEMO`。

#### Scenario: 租户登录页渲染

- **WHEN** 用户导航到 `/tenant/login`
- **THEN** 渲染包含用户名、密码和租户编码字段的登录表单

#### Scenario: 租户管理员登录成功

- **WHEN** 用户在登录页选择"租户管理员" Tab，输入账号 `tenant`、密码 `123456`、租户编码 `DEMO`
- **THEN** 系统验证通过后，存储 mock JWT 到 localStorage，跳转到 `/tenant/dashboard`

#### Scenario: 租户编码错误

- **WHEN** 用户输入正确的账号密码但租户编码为 `INVALID`
- **THEN** 系统显示错误提示"租户编码错误"

#### Scenario: 租户登录无效租户

- **WHEN** 用户提交有效凭证但无效租户编码
- **THEN** 系统显示关于无效租户的错误消息

### Requirement: 已认证用户重定向

系统 SHALL 将已认证用户从登录页重定向到对应角色的 Dashboard。

#### Scenario: 平台管理员访问平台登录页

- **WHEN** 已认证的 `platform_admin` 用户导航到 `/platform/login`
- **THEN** 重定向到 `/platform/dashboard`

#### Scenario: 租户管理员访问租户登录页

- **WHEN** 已认证的 `tenant_admin` 用户导航到 `/tenant/login`
- **THEN** 重定向到 `/tenant/dashboard`

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

### Requirement: PKCE 参数生成

系统 SHALL 提供 `src/utils/pkce.ts` 工具模块，包含以下函数：

- `generateCodeVerifier()`：生成 43-128 位的随机字符串，使用 `crypto.getRandomValues` + Base64URL 编码
- `generateCodeChallenge(verifier: string)`：对 code_verifier 执行 SHA-256 哈希后 Base64URL 编码，返回 code_challenge
- `generateState(role: string)`：生成 `{role}:{random}` 格式的 state 参数，random 部分为 16 字节随机值 Base64URL 编码

#### Scenario: 生成 code_verifier

- **WHEN** 调用 `generateCodeVerifier()`
- **THEN** 返回 43-128 位的 URL-safe 随机字符串

#### Scenario: 从 code_verifier 派生 code_challenge

- **WHEN** 调用 `generateCodeChallenge(codeVerifier)`
- **THEN** 返回 code_verifier 的 SHA-256 哈希的 Base64URL 编码值

#### Scenario: 生成带角色信息的 state

- **WHEN** 调用 `generateState('platform_admin')`
- **THEN** 返回 `platform_admin:{random}` 格式的字符串，random 部分为 Base64URL 编码的随机值

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

### Requirement: 受保护路由重定向

未登录用户访问需要认证的页面时，系统 SHALL 自动跳转到登录页。

#### Scenario: 未登录访问受保护页面

- **WHEN** 用户未登录直接访问 `/dashboard`
- **THEN** 系统跳转到登录页，登录成功后跳回原页面

### Requirement: Auth mock provides login endpoint

The mock system SHALL provide `/api/auth/login` endpoint that validates credentials and returns user info with token.

#### Scenario: Platform admin mock login

- **WHEN** a POST request to `/api/auth/login` with `{ username: "admin", password: "123456", role: "platform_admin" }`
- **THEN** the mock returns `{ code: 0, data: { userInfo: { role: "platform_admin", username: "admin" }, accessToken: "...", refreshToken: "..." } }`

#### Scenario: Tenant admin mock login

- **WHEN** a POST request to `/api/auth/login` with `{ username: "tenant", password: "123456", role: "tenant_admin", tenantCode: "DEMO" }`
- **THEN** the mock returns `{ code: 0, data: { userInfo: { role: "tenant_admin", username: "tenant", tenantCode: "DEMO" }, accessToken: "...", refreshToken: "..." } }`

#### Scenario: Invalid credentials mock login

- **WHEN** a POST request to `/api/auth/login` with invalid credentials
- **THEN** the mock returns `{ code: -1, message: "Invalid credentials" }`

### Requirement: Auth mock provides logout endpoint

The mock system SHALL provide `/api/auth/logout` endpoint.

#### Scenario: Mock logout

- **WHEN** a POST request to `/api/auth/logout`
- **THEN** the mock returns `{ code: 0, message: "success" }`

### Requirement: Auth mock provides refresh token endpoint

The mock system SHALL provide `/api/auth/refresh` endpoint for token refresh.

#### Scenario: Mock token refresh

- **WHEN** a POST request to `/api/auth/refresh` with a valid refresh token
- **THEN** the mock returns new access and refresh tokens

### Requirement: Menu mock returns role-based menus

The mock system SHALL provide `/api/menu/list` endpoint that returns different menus based on the user's role.

#### Scenario: Platform admin menu

- **WHEN** a request to `/api/menu/list` from a `platform_admin` user
- **THEN** the mock returns platform admin menu items (Dashboard, User Management, Role Management, Tenant Management, etc.)

#### Scenario: Tenant admin menu

- **WHEN** a request to `/api/menu/list` from a `tenant_admin` user
- **THEN** the mock returns tenant admin menu items (Dashboard, Profile, etc.)

### Requirement: Auth store uses HTTP calls in mock mode

The auth store SHALL use HTTP API calls (via Axios) for login, even in mock mode, instead of direct function calls.

#### Scenario: Login calls API

- **WHEN** `login()` is called in the auth store
- **THEN** it makes a POST request to `/api/auth/login` via Axios, regardless of mock mode

#### Scenario: Mock mode flag controls mock system

- **WHEN** `VITE_ENABLE_MOCK` is `true`
- **THEN** vite-plugin-mock intercepts the HTTP requests and returns mock data

### Requirement: Mock endpoints aligned with real API paths

系统 SHALL 在 mock 数据中提供与真实后端完全一致的 API 路径和响应结构。所有 mock 的 URL、HTTP 方法、请求参数 SHALL 与对应 API 模块（`src/api/modules/`）的实际调用行为完全匹配。

#### Scenario: App update mock URL matches API module

- **WHEN** 开发模式下前端调用 `appApi.update(data)` 发送 `PUT /api/v1/sys/app`（id 在 request body 中）
- **THEN** mock 系统 SHALL 拦截 `PUT /api/v1/sys/app` 并返回成功响应，不带 `{id}` 路径参数

#### Scenario: FileGroup update mock URL matches API module

- **WHEN** 开发模式下前端调用 `fileGroupApi.update(data)` 发送 `PUT /api/v1/sys/file-group`（id 在 request body 中）
- **THEN** mock 系统 SHALL 拦截 `PUT /api/v1/sys/file-group` 并返回成功响应，不带 `{id}` 路径参数

#### Scenario: Tenant mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/tenant/page`
- **THEN** 返回符合 `PagingInfo<SysTenantListResponse>` 结构的分页数据

#### Scenario: Tenant enable/disable mock

- **WHEN** 开发模式下请求 `PUT /api/v1/sys/tenant/1/enable` 或 `disable`
- **THEN** 返回成功响应

#### Scenario: PublicParam mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/public-param/page`
- **THEN** 返回符合 `PagingInfo<SysPublicParamListResponse>` 结构的分页数据
