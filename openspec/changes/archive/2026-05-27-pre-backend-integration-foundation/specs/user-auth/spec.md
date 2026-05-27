## MODIFIED Requirements

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
