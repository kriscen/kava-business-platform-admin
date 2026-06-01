## Context

前端基础设施已搭建核心骨架（双角色路由、DataTable、FormModal、API 拦截器、Auth 持久化），但在探索审计中发现若干缺陷：组件错误状态缺失、Token 刷新并发 bug、缺少基础页面（404）、无路由懒加载、面包屑层级不全。同时需要建立 i18n 硬编码禁令，为后续多语言扩展打基础。

当前技术栈：React 19 + TypeScript, Vite 8, shadcn/ui, Zustand, Axios, i18next, React Router DOM 7。

## Goals / Non-Goals

**Goals:**

- 修复影响所有业务页面的组件 bug（DataTable 错误态、Token 刷新队列）
- 补齐路由基础设施（404 页面、懒加载、嵌套 ErrorBoundary、面包屑递归）
- 提供可复用的 ConfirmDialog 组件替代 `window.confirm`
- 建立 i18n 规范，将现有硬编码字符串迁移到翻译文件
- 清理死代码

**Non-Goals:**

- 不添加 en-US 翻译内容（仅建立结构，保持 zh-CN 为唯一 locale）
- 不实现远端错误监控（Sentry 等）
- 不实现全局 loading 进度条（NProgress 等）
- 不实现 API 请求取消（AbortController）
- 不做 Theme 切换 UI
- 不实现 Language 切换 UI（i18n 规范先行，UI 后续补充）

## Decisions

### D1: DataTable 错误状态采用内部 state 管理

DataTable 已有 `loading` state，新增 `error` state（`string | null`）。fetchData 的 catch 设置 error，渲染 error UI（图标 + 消息 + 重试按钮）。选择内部管理而非外部 prop，因为 error 是 fetch 生命周期的一部分，与 loading 对称。

替代方案：暴露 `error` prop 让外部控制 → 增加了使用复杂度，且大多数场景的 error 来源就是 fetchData 本身。

### D2: ConfirmDialog 基于 shadcn AlertDialog

使用 shadcn/ui 的 AlertDialog 组件（基于 @base-ui/react Alert 原语），提供 `confirm()` 命令式 API（通过 `createConfirm` helper），支持 Promise 返回值。这样可以像 `window.confirm` 一样在事件处理中调用，但 UI 可定制。

替代方案：用 Dialog + useState → 每次使用都需要声明式管理状态，模板代码多。

### D3: 懒加载使用 React.lazy + Suspense 包裹路由

在 `App.tsx` 中将页面组件改为 `React.lazy()` 导入，在路由层级添加 `<Suspense>` fallback。Fallback 使用居中的 Spinner 组件。

### D4: 嵌套 ErrorBoundary 使用 React Router 的 errorElement

React Router v7 支持 `errorElement` 属性，可以在路由配置中指定错误 UI，无需手动包裹 ErrorBoundary。但当前项目使用的是自定义路由组件而非 data router，因此选择在 `Content.tsx` 的 `<Outlet>` 外层包裹 ErrorBoundary 组件，限制崩溃范围到内容区域（保留 Header 和 Sidebar）。

### D5: 面包屑递归匹配

改造 `useBreadcrumbs` 使用递归遍历 `routeConfig`，而非当前的固定两层循环。通过 `path-to-regexp` 或简单的路径分段匹配，将当前 URL 路径段逐级映射到 routeConfig 条目。

### D6: i18n 规范通过 `.claude/rules/i18n.md` 强制

创建 Claude Code 规则文件，要求所有用户可见字符串使用 `t()` 引用。翻译文件按模块组织（`common.json`, `layout.json`, `user.json` 等），key 使用点分命名空间。此规则约束 AI 辅助开发行为，不改变运行时逻辑。

## Risks / Trade-offs

- **DataTable error state 改动影响所有使用方** → 变更向后兼容，新增功能不影响现有 props
- **lazy loading 增加首屏后的 chunk 请求** → 收益大于成本，Vite 会自动优化 chunk 分割
- **i18n 迁移可能遗漏部分硬编码字符串** → 分批迁移，先覆盖通用组件和已有页面，后续新页面开发时按规范执行
- **ConfirmDialog 命令式 API 全局状态** → 使用 ReactDOM `createRoot` 渲染到独立容器，避免与 App 状态耦合
