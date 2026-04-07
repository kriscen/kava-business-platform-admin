# 错误码参考

## 错误分类

| 类型         | 说明                           |
| ------------ | ------------------------------ |
| `javascript` | JavaScript 运行时错误          |
| `promise`    | 未捕获的 Promise rejection     |
| `render`     | React 渲染错误 (ErrorBoundary) |
| `network`    | 网络请求错误                   |
| `business`   | 业务逻辑错误 (code !== 0)      |

## HTTP 错误

| 状态码 | 错误类型   | 用户提示       |
| ------ | ---------- | -------------- |
| 401    | 未授权     | 请重新登录     |
| 403    | 禁止访问   | 无权限访问     |
| 404    | 资源不存在 | 内容不存在     |
| 500    | 服务器错误 | 服务器内部错误 |
| 502    | 网关错误   | 网关错误       |
| 503    | 服务不可用 | 服务暂时不可用 |

## 业务错误

业务错误由后端返回，`code !== 0` 时触发。错误消息通过 `ApiResponse.message` 传递。

## 错误处理流程

1. **JavaScript 错误** → `window.onerror` → `handleError()`
2. **Promise rejection** → `window.onunhandledrejection` → `handleError()`
3. **React 渲染错误** → ErrorBoundary → `formatError('render', ...)`
4. **Axios 网络错误** → 响应拦截器 → 分类处理并 reject
5. **业务错误** → 响应拦截器 → reject data

## 监控接入

`handleError()` 预留了监控服务接入点，可集成 Sentry、LogRocket 等。
