# 错误码参考

## 错误分类

| 类型         | 说明                           |
| ------------ | ------------------------------ |
| `javascript` | JavaScript 运行时错误          |
| `promise`    | 未捕获的 Promise rejection     |
| `render`     | React 渲染错误 (ErrorBoundary) |
| `network`    | 网络请求错误                   |
| `business`   | 业务逻辑错误 (`success=false`) |

## HTTP 错误

| 状态码 | 错误类型   | Toast 提示                  |
| ------ | ---------- | --------------------------- |
| 401    | 未授权     | 自动刷新 token 或跳转登录页 |
| 403    | 禁止访问   | 禁止访问，无权限            |
| 404    | 资源不存在 | 请求的资源不存在            |
| 500    | 服务器错误 | 服务器内部错误              |
| 502    | 网关错误   | 网关错误                    |
| 503    | 服务不可用 | 服务暂时不可用              |

网络错误（`Network Error`）提示"网络连接失败，请检查网络"；请求超时（`ECONNABORTED`）提示"请求超时，请稍后重试"。

## 业务错误

业务错误由后端返回，`success === false` 时触发。错误消息通过 `ApiResponse.errorMessage` 传递，错误码通过 `ApiResponse.errorCode` 传递。

拦截器自动调用 `toast.error(errorMessage || '请求失败')` 向用户展示通知。

## 错误处理流程

1. **JavaScript 错误** → `window.onerror` → `handleError()`
2. **Promise rejection** → `window.onunhandledrejection` → `handleError()`
3. **React 渲染错误** → ErrorBoundary → `formatError('render', ...)`
4. **Axios HTTP 错误** → 响应拦截器 → toast 通知 + reject
5. **业务错误** (`success=false`) → 响应拦截器 → toast.error + reject
6. **401 Token 过期** → raw fetch 刷新 token → 成功则重试原请求；失败则 `toast.info`（使用 i18n key `common.tokenExpired`）提示用户，所有排队的 401 请求被 reject，然后跳转登录页

## 用户通知

所有 HTTP 错误和业务错误通过 shadcn/ui Sonner toast 组件向用户展示通知（`<Toaster />` 挂载在 App.tsx 根组件，位置 top-center，启用 richColors）。

## 监控接入

`handleError()` 预留了监控服务接入点，可集成 Sentry、LogRocket 等。

## 组件级错误模式

除全局错误处理外，部分组件实现了自身错误处理逻辑：

### DataTable 错误状态

`DataTable` 组件在 `fetchData` 失败时显示错误状态 UI：错误图标 + 错误消息 + 重试按钮。用户点击重试后重新发起请求。错误不会触发全局 toast，而是内联展示在表格区域。

### ConfirmDialog 异步错误

`ConfirmDialog` 的 `onConfirm` 支持异步操作。如果 `onConfirm` 抛出异常（Promise reject），错误通过 `toast.error` 展示通知，对话框保持打开状态，用户可以修正后重试。
