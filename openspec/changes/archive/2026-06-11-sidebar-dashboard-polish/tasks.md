## 1. Sidebar iconMap 扩展

- [x] 1.1 在 `src/components/layout/Sidebar.tsx` 中扩展 iconMap，添加所有设计文档中列出的图标映射（Users、Building2、Wrench、Shield、Menu、MapPin、Globe、Route、KeyRound、FileText、ClipboardList、File、FolderOpen、AppWindow、Group 等）
- [x] 1.2 验证：在 mock 模式下登录，确认 Sidebar 所有菜单项都有正确图标渲染

## 2. menuStore 补全 group 和 profile

- [x] 2.1 在 `src/stores/menuStore.ts` 的 ALL_MENUS 中 `system.children` 数组内添加 group（分组管理）条目，路径 `/system/group`，allowedRoles 为 `['platform_admin']`
- [x] 2.2 将 profile 菜单项的 allowedRoles 从 `['tenant_admin']` 改为 `['platform_admin', 'tenant_admin']`
- [x] 2.3 验证：platform_admin 登录后侧边栏可见"分组管理"和"个人信息"菜单项

## 3. Profile 路由对齐

- [x] 3.1 在 `src/App.tsx` 的 sharedRoutes 中，将 Profile 路由的 allowedRoles 从 `['tenant_admin']` 改为 `['platform_admin', 'tenant_admin']`
- [x] 3.2 验证：platform_admin 点击 Header 下拉菜单"个人信息"能正常跳转到 `/platform/profile` 页面

## 4. Dashboard 欢迎页

- [x] 4.1 在 `src/i18n/locales/zh-CN/dashboard.json` 中添加欢迎页翻译 key（问候语、快捷入口标题和描述等）
- [x] 4.2 重写 `src/pages/dashboard/Dashboard.tsx`：顶部问候区（用户名 + 日期 + 角色感知欢迎语）+ 快捷入口卡片网格（平台管理员：用户管理/租户管理/应用管理/角色管理；租户管理员：角色管理/菜单管理/OAuth 客户端/个人设置）
- [x] 4.3 验证：platform_admin 登录后 Dashboard 显示平台管理员问候语和对应快捷入口；tenant_admin 显示租户管理员内容；点击快捷入口卡片能正确跳转
