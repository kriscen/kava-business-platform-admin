## Why

在进入后端对接和业务页面开发之前，前端基础设施存在若干影响开发效率和稳定性的缺陷：DataTable 错误状态缺失、Token 刷新并发 bug、缺少 404 页面和路由懒加载等。同时需要建立 i18n 规范，禁止硬编码中文字符串，确保未来可扩展多语言。

## What Changes

- **DataTable 错误状态**：`data-table.tsx` 的 `fetchData` 无 catch，请求失败后永远显示骨架屏。需添加 error state + 重试按钮。
- **Token 刷新队列 bug**：`interceptors.ts` 中 refresh 失败时，队列中的订阅请求永远不会 resolve/reject，会挂起。
- **ConfirmDialog 组件**：`UserManagement.tsx` 使用 `window.confirm`，需替换为 shadcn/ui 风格的确认弹窗。
- **清理死代码**：`AdminLayout.tsx` 未被任何布局引用，需移除。
- **404 页面**：通配路由当前静默重定向，需添加专用 NotFound 页面。
- **路由懒加载**：所有页面静态 import，需改为 `React.lazy()` + `Suspense`，减小首屏包体积。
- **嵌套 ErrorBoundary**：仅顶层有 ErrorBoundary，单个页面崩溃导致整体白屏，需按路由区域隔离。
- **面包屑深层匹配**：`useBreadcrumbs` 仅支持 2 级，三级路由（如 `/platform/system/users`）面包屑不完整。
- **i18n 规范强制**：新增 `.claude/rules/i18n.md` 规则，禁止组件内硬编码中文字符串，必须通过 `t()` 引用翻译 key。

## Capabilities

### New Capabilities

- `confirm-dialog`: 可复用的确认弹窗组件，替代 `window.confirm`，支持异步操作、自定义文案、危险操作样式
- `not-found-page`: 404 页面，引导用户返回首页或上一页
- `route-lazy-loading`: 路由级代码分割，`React.lazy()` + `Suspense` loading fallback
- `i18n-convention`: i18n 开发规范——翻译文件结构、key 命名、禁止硬编码的规则

### Modified Capabilities

- `data-table`: 添加 error 状态（请求失败的 UI 反馈和重试机制）
- `error-notification`: 添加嵌套 ErrorBoundary，按路由区域隔离崩溃爆炸半径
- `page-metadata`: `useBreadcrumbs` 支持三级及以上路由嵌套

## Impact

- `src/components/data-table.tsx` — 添加 error/loading 双态管理
- `src/api/interceptors.ts` — 修复 refresh 失败时队列清理逻辑
- `src/components/ui/` — 新增 ConfirmDialog
- `src/components/layout/AdminLayout.tsx` — 删除
- `src/pages/NotFound.tsx` — 新增
- `src/App.tsx` — 路由懒加载、404 路由、嵌套 ErrorBoundary
- `src/hooks/useBreadcrumbs.ts` — 递归匹配修复
- `.claude/rules/i18n.md` — 新增规则文件
- `src/i18n/locales/zh-CN/` — 补充缺失的翻译 key
