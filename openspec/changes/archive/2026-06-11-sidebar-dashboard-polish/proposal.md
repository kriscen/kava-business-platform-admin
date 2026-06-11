## Why

Sidebar 的 iconMap 只有 3 个图标映射，menuStore 缺少 group 条目，Dashboard 是占位页面。这些是 Phase 1 收尾前需要完善的体验细节。同时 Profile 路由与 Header 下拉菜单的角色覆盖不一致，需要统一。

## What Changes

- **Sidebar iconMap 补全**：扩展图标映射表，覆盖所有当前菜单配置中使用的图标名称，并预留常用图标供未来菜单项使用
- **menuStore 补全 group**：在 `ALL_MENUS` 中添加分组管理（`system/group`）条目，与已有路由注册对齐
- **Dashboard 改为欢迎页**：从纯占位文字改为带用户问候语和角色感知快捷入口卡片的欢迎页面
- **Profile 路由对齐**：platform_admin 角色也开放 Profile 页面访问，与 Header 下拉菜单行为一致

## Capabilities

### New Capabilities

- `welcome-page`: Dashboard 欢迎页，根据用户角色展示不同问候语和快捷入口卡片

### Modified Capabilities

- `app-shell`: Sidebar iconMap 扩展、menuStore ALL_MENUS 补全 group 条目、Profile 路由对齐 platform_admin

## Impact

- `src/components/layout/Sidebar.tsx`：iconMap 扩展
- `src/stores/menuStore.ts`：ALL_MENUS 增加 group 条目
- `src/pages/dashboard/Dashboard.tsx`：重写为欢迎页
- `src/App.tsx`：Profile 路由 allowedRoles 增加 platform_admin
- `src/i18n/locales/zh-CN/dashboard.json`：新增欢迎页相关翻译 key
- `src/i18n/locales/zh-CN/layout.json`：可能新增 group 菜单翻译 key
