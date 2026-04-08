## Why

当前页面标题和面包屑是静态的或需要手动传入 props，导致：

- 页面间导航时标题不同步
- 面包屑始终显示固定的"首页"
- 开发者容易遗漏标题更新

动态标题和面包屑能提升用户体验，让用户清楚知道自己在应用中的位置。

## What Changes

- 新增 `src/routes/config.ts` 路由配置文件，集中管理路由元数据（标题、图标、面包屑层级）
- 新增 `usePageTitle()` Hook，自动同步页面标题到 Header
- 新增 `useBreadcrumbs()` Hook，根据当前路由自动生成面包屑路径
- 重构 `Header` 组件，使用动态标题
- 重构 `Content` 组件，使用动态面包屑
- 路由配置复用现有 i18n key，保持与 menuStore 一致

## Capabilities

### New Capabilities

- `page-metadata`: 路由元数据管理，包括标题、i18n key、面包屑层级配置

### Modified Capabilities

- `role-based-menu`: 当前菜单使用 i18n key，路由配置复用相同 key 实现标题同步

## Impact

- 新增文件：`src/routes/config.ts`, `src/hooks/usePageTitle.ts`, `src/hooks/useBreadcrumbs.ts`
- 修改文件：`src/components/layout/Header.tsx`, `src/components/layout/Content.tsx`, `src/App.tsx`
- 依赖：i18next 已集成，标题使用 `menu.*` key
