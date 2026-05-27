# 错误码参考

## 错误分类

| 类型         | 说明                           |
| ------------ | ------------------------------ |
| `javascript` | JavaScript 运行时错误          |
| `promise`    | 未捕获的 Promise rejection     |
| `render`     | React 渲染错误 (ErrorBoundary) |
| `network`    | 网络请求错误                   |
| `business`   | 业务逻辑错误 (`code !== '0'`)  |

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

业务错误由后端返回，`code !== '0'` 时触发。错误消息通过 `ApiResponse.msg` 传递（对齐后端 `JsonResult`，`code` 类型为 `string`，`"0"` 表示成功）。

拦截器自动调用 `toast.error(msg || '请求失败')` 向用户展示通知。

## 错误处理流程

1. **JavaScript 错误** → `window.onerror` → `handleError()`
2. **Promise rejection** → `window.onunhandledrejection` → `handleError()`
3. **React 渲染错误** → ErrorBoundary → `formatError('render', ...)`
4. **Axios HTTP 错误** → 响应拦截器 → toast 通知 + reject
5. **业务错误** (`code !== '0'`) → 响应拦截器 → toast.error + reject
6. **401 Token 过期** → raw fetch 刷新 token → 成功则重试原请求，失败则 toast.info + 跳转登录页

## 用户通知

所有 HTTP 错误和业务错误通过 shadcn/ui Sonner toast 组件向用户展示通知（`<Toaster />` 挂载在 App.tsx 根组件，位置 top-center，启用 richColors）。

## 监控接入

`handleError()` 预留了监控服务接入点，可集成 Sentry、LogRocket 等。
