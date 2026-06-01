## MODIFIED Requirements

### Requirement: Token 过期提示

Token 刷新失败导致登出时 SHALL 展示提示 toast，且所有排队的 401 请求 SHALL 被正确 reject 而非永远挂起。

#### Scenario: refresh_token 过期登出

- **WHEN** token 刷新失败，系统执行 `clearAuthAndRedirect()`
- **THEN** 在跳转登录页前展示 `toast.info`（使用 i18n key）

#### Scenario: 刷新失败后排队请求被 reject

- **WHEN** refresh 请求返回失败，且有多于 1 个请求在队列中等待
- **THEN** 所有排队请求的 Promise 被 reject，而非永远挂起
