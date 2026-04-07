# 模块边界

## API 层 (`src/api/`)

Axios 实例封装，统一处理请求/响应。

### 请求拦截器

- 自动添加 `Authorization: Bearer {token}` (从 localStorage 读取)
- 可扩展：添加 timestamp、nonce 等防重放参数

### 响应拦截器

- 业务错误：`code !== 0` 时 reject，返回完整 ApiResponse
- HTTP 错误：按状态码 (401/403/404/500/502/503) 分类处理并 reject

## 状态层 (`src/stores/`)

Zustand store，使用 `persist` + `devtools` 中间件。

### appStore

```typescript
{
  sidebarCollapsed: boolean // 侧边栏折叠状态
  language: string // 当前语言 (zh-CN)
  theme: 'light' | 'dark' // 主题模式
}
```

持久化到 localStorage (key: `app-storage`)，仅保存这三个字段。

## 布局层 (`src/components/layout/`)

- **AdminLayout**: 根布局，响应式处理 (< 768px 自动折叠侧边栏)
- **Sidebar**: 导航菜单，支持折叠/展开
- **Header**: 顶部栏
- **Content**: 内容区

## 错误边界 (`src/components/ErrorBoundary/`)

全局捕获 React 渲染错误，记录 componentStack 并输出到控制台。

预留监控服务接入点 (Sentry、LogRocket 等)。

## 错误处理分类

| 类型         | 来源               |
| ------------ | ------------------ |
| `javascript` | window.onerror     |
| `promise`    | unhandledrejection |
| `render`     | ErrorBoundary      |
| `network`    | Axios 网络错误     |
| `business`   | API code !== 0     |
