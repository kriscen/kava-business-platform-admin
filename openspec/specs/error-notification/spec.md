## ADDED Requirements

### Requirement: Toast 组件集成

系统 SHALL 接入 shadcn/ui Sonner toast 组件，在应用根组件提供全局 `<Toaster />`。

#### Scenario: Toaster 挂载在根组件

- **WHEN** 应用启动
- **THEN** `App.tsx` 中渲染 `<Toaster />` 组件，所有页面均可触发 toast 通知

### Requirement: 响应拦截器展示业务错误 toast

响应拦截器检测到业务错误（`code !== '0'`）时 SHALL 展示 toast 错误通知。

#### Scenario: 业务错误展示错误消息

- **WHEN** 后端返回 `{ "code": "A00403", "msg": "租户已停用" }`
- **THEN** 拦截器调用 `toast.error('租户已停用')`，用户看到错误 toast

#### Scenario: 业务错误无 msg 字段

- **WHEN** 后端返回 `{ "code": "99999", "msg": "" }` 且 msg 为空
- **THEN** 拦截器展示默认消息 `toast.error('请求失败')`

### Requirement: HTTP 错误分类展示 toast

响应拦截器 SHALL 根据 HTTP 状态码分类展示对应的错误 toast。

#### Scenario: 403 禁止访问

- **WHEN** 后端返回 403
- **THEN** 展示 `toast.error('禁止访问，无权限')`

#### Scenario: 404 资源不存在

- **WHEN** 后端返回 404
- **THEN** 展示 `toast.error('请求的资源不存在')`

#### Scenario: 500 服务器错误

- **WHEN** 后端返回 500
- **THEN** 展示 `toast.error('服务器内部错误')`

#### Scenario: 502 网关错误

- **WHEN** 后端返回 502
- **THEN** 展示 `toast.error('网关错误')`

#### Scenario: 503 服务不可用

- **WHEN** 后端返回 503
- **THEN** 展示 `toast.error('服务暂时不可用')`

#### Scenario: 网络连接失败

- **WHEN** 请求因网络错误失败（`error.message === 'Network Error'`）
- **THEN** 展示 `toast.error('网络连接失败，请检查网络')`

#### Scenario: 请求超时

- **WHEN** 请求超时（`error.code === 'ECONNABORTED'`）
- **THEN** 展示 `toast.error('请求超时，请稍后重试')`

### Requirement: Token 过期提示

Token 刷新失败导致登出时 SHALL 展示提示 toast，且所有排队的 401 请求 SHALL 被正确 reject 而非永远挂起。

#### Scenario: refresh_token 过期登出

- **WHEN** token 刷新失败，系统执行 `clearAuthAndRedirect()`
- **THEN** 在跳转登录页前展示 `toast.info`（使用 i18n key）

#### Scenario: 刷新失败后排队请求被 reject

- **WHEN** refresh 请求返回失败，且有多于 1 个请求在队列中等待
- **THEN** 所有排队请求的 Promise 被 reject，而非永远挂起
