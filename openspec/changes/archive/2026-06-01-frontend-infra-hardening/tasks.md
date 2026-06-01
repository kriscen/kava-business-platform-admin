## 1. i18n 规范与规则

- [x] 1.1 创建 `.claude/rules/i18n.md` 规则文件，定义禁止硬编码、翻译文件结构、key 命名规范
- [x] 1.2 在 `CLAUDE.md` 中通过 `@.claude/rules/i18n.md` 引入规则
- [x] 1.3 改造 `src/i18n/index.ts` 支持按模块加载翻译文件（从 `locales/zh-CN/` 目录自动导入所有 JSON）

## 2. i18n 硬编码迁移

- [x] 2.1 迁移 `src/components/data-table.tsx` 中硬编码字符串到翻译文件
- [x] 2.2 迁移 `src/components/form-modal.tsx` 中硬编码字符串到翻译文件
- [x] 2.3 迁移 `src/components/layout/Sidebar.tsx` 中硬编码字符串到翻译文件
- [x] 2.4 迁移 `src/stores/menuStore.ts` 中硬编码字符串到翻译文件
- [x] 2.5 迁移 `src/pages/` 下所有页面中的硬编码字符串到翻译文件
- [x] 2.6 迁移 `src/components/ErrorBoundary/index.tsx` 中硬编码字符串到翻译文件
- [x] 2.7 验证 `pnpm dev` 所有页面正常显示，无翻译 key 缺失

## 3. Bug 修复 — DataTable 错误状态

- [x] 3.1 在 `src/components/data-table.tsx` 添加 `error` state，fetchData catch 中设置 error
- [x] 3.2 实现 error 状态 UI（错误图标 + 消息 + 重试按钮），替换骨架屏
- [x] 3.3 重试按钮触发重新 fetchData，先清空 error 再请求
- [x] 3.4 验证：断开 mock 后表格显示错误状态，点击重试恢复正常

## 4. Bug 修复 — Token 刷新队列

- [x] 4.1 在 `src/api/interceptors.ts` 的 refresh 失败分支中，reject 所有 `refreshSubscribers` 队列中的 callback
- [x] 4.2 reject 后清空 `refreshSubscribers` 数组
- [x] 4.3 验证：模拟 refresh 失败，确认无请求挂起

## 5. ConfirmDialog 组件

- [x] 5.1 安装 shadcn AlertDialog 组件（`npx shadcn@latest add alert-dialog`）
- [x] 5.2 创建 `src/components/confirm-dialog.tsx`，实现命令式 `confirm()` API
- [x] 5.3 支持 `title`、`description`、`confirmText`、`cancelText`、`variant`（destructive）参数
- [x] 5.4 支持 `onConfirm` 异步回调 + loading 状态
- [x] 5.5 替换 `src/pages/platform/UserManagement.tsx` 中的 `window.confirm` 为 `confirm()`
- [x] 5.6 验证：删除用户时弹出 ConfirmDialog，确认/取消流程正常

## 6. 清理死代码

- [x] 6.1 删除 `src/components/layout/AdminLayout.tsx`
- [x] 6.2 搜索全项目确认无其他文件 import AdminLayout

## 7. 404 页面

- [x] 7.1 创建 `src/pages/NotFound.tsx`，显示 404 错误码、提示信息和返回按钮
- [x] 7.2 返回按钮根据当前用户角色跳转到对应 Dashboard
- [x] 7.3 修改 `App.tsx` 通配路由 `<Route path="*" .../>` 渲染 NotFound
- [x] 7.4 验证：访问 `/unknown` 显示 404 页面

## 8. 路由懒加载

- [x] 8.1 将 `App.tsx` 中所有页面静态 import 改为 `React.lazy()` 动态导入
- [x] 8.2 创建 `src/components/ui/spinner.tsx` loading fallback 组件
- [x] 8.3 在路由外层添加 `<Suspense fallback={<Spinner />}>`
- [x] 8.4 验证：`pnpm build` 生成多个 chunk，`pnpm dev` 路由切换正常

## 9. 嵌套 ErrorBoundary

- [x] 9.1 重构 `src/components/ErrorBoundary/index.tsx` 为可复用组件（接受 `fallback` prop）
- [x] 9.2 在 `src/components/layout/Content.tsx` 的 `<Outlet>` 外层包裹 ErrorBoundary
- [x] 9.3 验证：在某个页面中抛出错误，仅内容区域显示错误 UI，Header/Sidebar 不受影响

## 10. 面包屑递归修复

- [x] 10.1 重构 `src/hooks/useBreadcrumbs.ts`，使用递归遍历 routeConfig 匹配任意层级路径
- [x] 10.2 未匹配的路径段跳过，继续匹配后续段
- [x] 10.3 验证：访问 `/platform/system/users` 显示完整三级面包屑
