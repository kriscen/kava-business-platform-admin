# Layout System Spec

## Purpose

统一布局系统，合并 PlatformLayout 和 TenantLayout 为单一 MainLayout，通过角色标记动态过滤菜单，并集中管理路由元数据（页面标题和面包屑）。

## Requirements

### Requirement: 统一 MainLayout 组件

系统 SHALL 提供单一的 `MainLayout` 组件，替代 `PlatformLayout` 和 `TenantLayout`，包含 Sidebar、Header 和 Content 三个子组件。

#### Scenario: 平台管理员使用 MainLayout

- **WHEN** `platform_admin` 用户访问任意已认证路由
- **THEN** `MainLayout` 渲染侧边栏（显示平台管理员菜单）、Header（显示用户名和登出按钮）、Content 区域

#### Scenario: 租户管理员使用 MainLayout

- **WHEN** `tenant_admin` 用户访问任意已认证路由
- **THEN** `MainLayout` 渲染侧边栏（显示租户管理员菜单）、Header（显示用户名和登出按钮）、Content 区域

### Requirement: MainLayout 根据角色动态配置菜单

MainLayout SHALL 从 menu store 获取当前角色对应的菜单列表，无需根据角色切换 Layout 组件。

#### Scenario: MainLayout 加载时构建菜单

- **WHEN** `MainLayout` 组件挂载
- **THEN** 调用 `menuStore.buildMenus()`，该方法根据 `authStore` 中的角色自动返回正确的菜单

### Requirement: 侧边栏折叠响应式

MainLayout SHALL 支持侧边栏折叠/展开，状态由组件内部管理。

#### Scenario: 点击折叠按钮

- **WHEN** 用户点击侧边栏折叠按钮
- **THEN** 侧边栏在展开和折叠状态之间切换，Content 区域自适应宽度

### Requirement: 删除旧的 Layout 文件

重构完成后 SHALL 删除 `PlatformLayout.tsx` 和 `TenantLayout.tsx`，所有路由统一使用 `MainLayout`。

#### Scenario: 旧 Layout 不再被引用

- **WHEN** 重构完成后检查代码库
- **THEN** `PlatformLayout` 和 `TenantLayout` 文件不存在，无任何文件 import 它们

### Requirement: JWT 包含角色信息

登录成功后获取的 JWT payload SHALL 包含用户角色信息，用于前端动态渲染菜单。

#### Scenario: JWT 包含 platform_admin 角色

- **WHEN** 平台管理员登录成功
- **THEN** JWT payload 包含 `{ "role": "platform_admin", "username": "admin" }`

#### Scenario: JWT 包含 tenant_admin 角色

- **WHEN** 租户管理员登录成功
- **THEN** JWT payload 包含 `{ "role": "tenant_admin", "tenantCode": "DEMO", "username": "tenant" }`

### Requirement: 动态菜单渲染

系统 SHALL 使用统一的菜单配置数组，每个菜单项带有 `allowedRoles` 字段标记可见角色。`buildMenus()` 方法根据当前用户角色过滤菜单项，而非硬编码两套独立数组。

#### Scenario: 平台管理员看到所有菜单

- **WHEN** 平台管理员登录成功
- **THEN** 侧边栏显示所有 `allowedRoles` 包含 `platform_admin` 的菜单项，包括系统管理（用户管理、角色管理等）

#### Scenario: 租户管理员看到受限菜单

- **WHEN** 租户管理员登录成功
- **THEN** 侧边栏仅显示 `allowedRoles` 包含 `tenant_admin` 的菜单项，不显示系统管理中仅限平台管理员的子项

#### Scenario: 菜单项同时允许两个角色

- **WHEN** 菜单项的 `allowedRoles` 为 `['platform_admin', 'tenant_admin']`
- **THEN** 两种角色均可见该菜单项

### Requirement: Menu store supports role-based filtering

The menu store SHALL provide a `buildMenus()` method that reads the current user's role from `authStore` and filters a single unified menu configuration array by `allowedRoles`.

#### Scenario: Get menu by role

- **WHEN** `buildMenus()` is called while the current user has `platform_admin` role
- **THEN** it returns all menu items where `allowedRoles` includes `platform_admin`

#### Scenario: Get menu by role for tenant

- **WHEN** `buildMenus()` is called while the current user has `tenant_admin` role
- **THEN** it returns all menu items where `allowedRoles` includes `tenant_admin`

### Requirement: 路由元数据配置

系统 SHALL 提供集中的路由配置文件 `src/routes/config.ts`，包含所有已注册路由的标题 i18n key 和面包屑层级，包括 dept、tenant、public-param 条目。

#### Scenario: 配置文件包含所有路由元数据

- **WHEN** 应用启动
- **THEN** `routeConfig` 导出包含所有主要路由的配置对象，包括 `/platform/system/dept`、`/platform/system/tenant`、`/platform/system/public-param`，每个配置包含 `path`、`titleKey`、`parentPath` 属性

#### Scenario: 路由配置与布局 i18n key 一致

- **WHEN** 开发者定义路由元数据
- **THEN** `titleKey` 必须使用 `layout.*` namespace 的 i18n key（如 `layout.dashboard`、`layout.userManagement`）

#### Scenario: 租户路由同样有元数据

- **WHEN** 租户管理员访问 `/tenant/system/users`
- **THEN** 面包屑正确显示"首页 / 系统管理 / 用户管理"

### Requirement: usePageTitle Hook

系统 SHALL 提供 `usePageTitle()` Hook，自动将当前路由对应的标题同步到 Header。

#### Scenario: 自动模式设置页面标题

- **WHEN** 用户访问 `/dashboard`
- **THEN** Header 显示"仪表盘"（从 i18n `layout.dashboard` 读取）

#### Scenario: 手动模式覆盖页面标题

- **WHEN** 调用 `usePageTitle('自定义标题')`
- **THEN** Header 显示"自定义标题"，忽略配置中的默认标题

#### Scenario: 标题回退处理

- **WHEN** i18n key 不存在
- **THEN** 显示路由路径作为标题（如 `/system/users`）

### Requirement: useBreadcrumbs Hook

系统 SHALL 提供 `useBreadcrumbs()` Hook，根据当前路由和配置自动生成面包屑路径，支持任意层级嵌套。

#### Scenario: 顶层路由面包屑

- **WHEN** 用户访问 `/dashboard`
- **THEN** 面包屑仅显示"首页"

#### Scenario: 子路由面包屑

- **WHEN** 用户访问 `/system/users`
- **THEN** 面包屑显示"首页 / 系统管理 / 用户管理"

#### Scenario: 多层级嵌套路由面包屑

- **WHEN** 用户访问三级或更深路径（如 `/platform/system/users`）
- **THEN** 面包屑递归匹配所有父级路由段，显示完整路径（如"首页 / 平台 / 系统管理 / 用户管理"）

#### Scenario: 未匹配路径段回退

- **WHEN** 当前 URL 包含 routeConfig 中未定义的路径段
- **THEN** 跳过该段，继续匹配后续段

### Requirement: Header 组件集成动态标题

Header 组件 SHALL 使用 `usePageTitle()` 自动显示当前页面标题，无需手动传入 prop。

#### Scenario: 页面切换标题更新

- **WHEN** 用户从 `/dashboard` 导航到 `/system/users`
- **THEN** Header 标题从"仪表盘"更新为"用户管理"

### Requirement: Content 组件集成动态面包屑

Content 组件 SHALL 使用 `useBreadcrumbs()` 自动渲染面包屑。

#### Scenario: 面包屑点击跳转

- **WHEN** 面包屑显示"首页 / 系统管理 / 用户管理"
- **THEN** 点击任意面包屑项跳转到对应路径

### Requirement: AdminLayout 整合

`AdminLayout` SHALL 在路由变化时自动触发元数据更新。

#### Scenario: 嵌套路由 Outlet 内容切换

- **WHEN** 嵌套路由 `/` → `/dashboard` 或 `/system/users` 变化
- **THEN** Header 标题和面包屑自动更新
