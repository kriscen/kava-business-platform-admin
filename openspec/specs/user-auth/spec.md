# User Authentication Spec

## Purpose

TBD

## ADDED Requirements

### Requirement: 平台管理员登录

系统 SHALL 提供平台管理员登录功能，用户输入账号密码（密码为 `123456`）即可登录。

#### Scenario: Mock 模式下平台管理员登录成功

- **WHEN** 用户在登录页选择"平台管理员" Tab，输入账号 `admin` 和密码 `123456`
- **THEN** 系统验证通过后，存储 mock JWT 到 localStorage，跳转到 `/dashboard`

#### Scenario: Mock 模式下平台管理员登录失败

- **WHEN** 用户在登录页选择"平台管理员" Tab，输入错误的密码
- **THEN** 系统显示错误提示"账号或密码错误"

### Requirement: 租户管理员登录

系统 SHALL 提供租户管理员登录功能，用户需输入账号、密码（密码为 `123456`）和租户编码。

#### Scenario: Mock 模式下租户管理员登录成功

- **WHEN** 用户在登录页选择"租户管理员" Tab，输入账号 `tenant`、密码 `123456`、租户编码 `DEMO`
- **THEN** 系统验证通过后，存储 mock JWT 到 localStorage，跳转到 `/dashboard`

#### Scenario: Mock 模式下租户编码错误

- **WHEN** 用户在登录页选择"租户管理员" Tab，输入正确的账号密码但租户编码为 `INVALID`
- **THEN** 系统显示错误提示"租户编码错误"

### Requirement: OAuth2 授权码模式登录

系统 SHALL 支持 OAuth2 授权码模式，真实环境下跳转到后端授权页进行登录。

#### Scenario: 真实环境下跳转 OAuth2 授权页

- **WHEN** 用户在登录页点击"登录"（Mock 环境除外）
- **THEN** 系统跳转到 `/oauth2/authorize?client_id=xxx&redirect_uri=xxx&response_type=code&scope=read`

#### Scenario: OAuth2 回调处理

- **WHEN** 用户在 OAuth2 授权页完成授权后，浏览器被 redirect 到 `/oauth/callback?code=xxx`
- **THEN** 系统调用 `/oauth2/token` 使用授权码换取 access_token 和 refresh_token，存储 token 后跳转到 `/dashboard`

### Requirement: Token 刷新

系统 SHALL 支持 access_token 过期后使用 refresh_token 自动刷新，且刷新请求 MUST 使用 raw fetch（不经过 Axios 拦截器）以避免循环调用。authStore 中不再提供 `refreshAccessToken` 方法。

#### Scenario: access_token 过期自动刷新

- **WHEN** API 请求返回 401
- **THEN** 拦截器使用 raw fetch 调用 `/oauth2/token` with `grant_type=refresh_token`，成功后更新 authStore 中的 token 并重试原请求

#### Scenario: 并发请求时 token 刷新队列

- **WHEN** 多个请求同时收到 401
- **THEN** 仅第一个请求触发刷新，其余请求排队等待刷新完成后使用新 token 重试

#### Scenario: refresh_token 也过期

- **WHEN** 刷新 token 请求返回非 200
- **THEN** 系统展示 `toast.info('登录已过期，请重新登录')`，清除本地登录状态，跳转到登录页

#### Scenario: authStore 不再暴露 refreshAccessToken 方法

- **WHEN** 检查 authStore 的公开 API
- **THEN** 不存在 `refreshAccessToken` 方法，所有 token 刷新逻辑由拦截器内部处理

### Requirement: 登录状态持久化

系统 SHALL 将登录状态持久化到 localStorage，刷新页面后保持登录状态。

#### Scenario: 刷新页面后保持登录

- **WHEN** 用户已登录后刷新页面
- **THEN** 系统从 localStorage 恢复 token 和用户信息，继续保持登录状态

### Requirement: 登出

系统 SHALL 提供登出功能，清除本地登录状态并跳转到登录页。

#### Scenario: 用户点击登出

- **WHEN** 用户点击 Header 中的"登出"按钮
- **THEN** 系统清除 localStorage 中的 token 和用户信息，跳转到登录页

### Requirement: 受保护路由重定向

未登录用户访问需要认证的页面时，系统 SHALL 自动跳转到登录页。

#### Scenario: 未登录访问受保护页面

- **WHEN** 用户未登录直接访问 `/dashboard`
- **THEN** 系统跳转到登录页，登录成功后跳回原页面
