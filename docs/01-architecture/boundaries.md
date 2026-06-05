# 模块边界

## API 层 (`src/api/`)

Axios 实例封装，统一处理请求/响应。

### 请求拦截器

- 自动添加 `Authorization: Bearer {token}` (从 authStore 读取)
- 可扩展：添加 timestamp、nonce 等防重放参数

### 响应拦截器

- 业务错误：`code !== '0'` 时通过 `toast.error(msg)` 展示通知并 reject
- HTTP 错误：按状态码 (401/403/404/500/502/503) 分类展示 toast 并 reject
- Token 刷新：401 时使用 raw fetch（不经 Axios）刷新 token，并发请求排队等待；刷新失败时所有排队的 `refreshSubscribers` 回调被 **reject**（不会悬挂），数组清空

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

### authStore

管理认证状态，包括用户信息、token、登录/登出逻辑。登录成功后根据角色跳转到对应后台（`/platform/dashboard` 或 `/tenant/dashboard`）。

### menuStore

管理菜单配置，使用统一的 `ALL_MENUS` 数组 + `allowedRoles` 字段，`buildMenus()` 根据当前用户角色过滤菜单项。菜单路径为相对路径，渲染时通过 `getBasePath(role)` 拼接 `/platform` 或 `/tenant` 前缀。

## 布局层

### 页面布局 (`src/layouts/`)

- **MainLayout**: 统一后台布局，包含 Sidebar、Header、Content 三个子组件。根据当前用户角色从 menuStore 获取对应菜单，无需按角色切换 Layout

### 公共组件 (`src/components/layout/`)

- **Sidebar**: 导航菜单，支持折叠/展开，按角色渲染不同菜单项
- **Header**: 顶部栏，显示用户信息和登出按钮
- **Content**: 内容区，包裹 `<Outlet>` 的 ErrorBoundary 提供页面级崩溃隔离

## 错误边界 (`src/components/ErrorBoundary/`)

嵌套式 ErrorBoundary，实现崩溃隔离：

- **App 根级**：`App.tsx` 顶层 ErrorBoundary 捕获全局未处理的渲染错误
- **页面内容级**：`Content.tsx` 中 `<Outlet>` 被 ErrorBoundary 包裹，页面级渲染崩溃只影响内容区域，Header 和 Sidebar 保持可用，用户可通过导航离开错误页面

记录 componentStack 并输出到控制台。预留监控服务接入点 (Sentry、LogRocket 等)。

## 错误处理分类

| 类型         | 来源               |
| ------------ | ------------------ |
| `javascript` | window.onerror     |
| `promise`    | unhandledrejection |
| `render`     | ErrorBoundary      |
| `network`    | Axios 网络错误     |
| `business`   | API code !== '0'   |
