# 模块边界

## API 层 (`src/api/`)

Axios 实例封装，统一处理请求/响应。

### 请求拦截器

- 自动添加 `Authorization: Bearer {token}` (从 authStore 读取)
- 可扩展：添加 timestamp、nonce 等防重放参数

### 响应拦截器

- 业务错误：`code !== '0'` 时通过 `toast.error(msg)` 展示通知并 reject
- HTTP 错误：按状态码 (401/403/404/500/502/503) 分类展示 toast 并 reject
- Token 刷新：401 时使用 raw fetch（不经 Axios）刷新 token，并发请求排队等待

### API 模块 (`src/api/modules/`)

按后端资源模块组织，每个文件导出同名 API 对象：

- `userApi`、`roleApi`、`menuApi`、`deptApi`、`tenantApi`
- 标准方法：`getPage`、`getById`、`create`、`update`、`remove`
- 特殊方法：`getDropdown`（角色/租户）、`getTree`（菜单/部门）、`enable/disable`（租户）

认证端点在 `src/api/auth.ts`（`refreshToken`、`exchangeCode`），使用 raw fetch 避免 401 拦截器循环。

### 类型系统 (`src/types/`)

- `api.ts`：`ApiResponse<T>` — 对齐后端 `JsonResult<T>`（`code: string`、`msg`、`data`）
- `common.ts`：`PageQuery`、`PagingInfo<T>`、`DropdownItem`、`IdParam` 等通用类型
- 按实体分文件：`user.ts`、`role.ts`、`menu.ts`、`dept.ts`、`tenant.ts`，各含 Query/Request/Response 类型
- `index.ts` 统一重新导出，外部通过 `@/types` 引用

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
| `business`   | API code !== '0'   |
