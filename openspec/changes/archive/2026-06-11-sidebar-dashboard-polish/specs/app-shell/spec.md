## MODIFIED Requirements

### Requirement: 动态菜单渲染

系统 SHALL 使用统一的菜单配置数组，每个菜单项带有 `allowedRoles` 字段标记可见角色。`buildMenus()` 方法根据当前用户角色过滤菜单项，而非硬编码两套独立数组。ALL_MENUS SHALL 包含 group（分组管理）条目和 profile 条目。

#### Scenario: 平台管理员看到所有菜单

- **WHEN** 平台管理员登录成功
- **THEN** 侧边栏显示所有 `allowedRoles` 包含 `platform_admin` 的菜单项，包括系统管理（用户管理、分组管理、角色管理等）和个人信息

#### Scenario: 租户管理员看到受限菜单

- **WHEN** 租户管理员登录成功
- **THEN** 侧边栏仅显示 `allowedRoles` 包含 `tenant_admin` 的菜单项，包括个人信息

#### Scenario: 菜单项同时允许两个角色

- **WHEN** 菜单项的 `allowedRoles` 为 `['platform_admin', 'tenant_admin']`
- **THEN** 两种角色均可见该菜单项

#### Scenario: 分组管理菜单可见

- **WHEN** 平台管理员登录成功
- **THEN** 侧边栏系统管理子菜单中显示"分组管理"菜单项，路径为 `/platform/system/group`

### Requirement: Sidebar 图标映射

Sidebar 组件 SHALL 维护完整的 iconMap，覆盖所有菜单配置中使用的图标名称，确保每个菜单项都有对应图标。

#### Scenario: 顶级菜单图标渲染

- **WHEN** 顶级菜单项的 icon 字段为 "LayoutDashboard"
- **THEN** Sidebar 渲染 LayoutDashboard lucide-react 图标

#### Scenario: 未映射图标优雅降级

- **WHEN** 菜单项的 icon 字段值不在 iconMap 中
- **THEN** Sidebar 不渲染图标，不抛出错误

#### Scenario: 所有当前菜单项都有图标

- **WHEN** 渲染 menuStore ALL_MENUS 中的所有菜单项
- **THEN** 每个菜单项都能在 iconMap 中找到对应的 lucide-react 图标组件

### Requirement: Profile 路由双角色支持

Profile 页面路由 SHALL 同时允许 platform_admin 和 tenant_admin 角色访问。

#### Scenario: 平台管理员访问个人资料

- **WHEN** platform_admin 用户点击 Header 下拉菜单中的"个人信息"
- **THEN** 导航到 `/platform/profile`，正常渲染 Profile 页面

#### Scenario: 租户管理员访问个人资料

- **WHEN** tenant_admin 用户点击 Header 下拉菜单中的"个人信息"
- **THEN** 导航到 `/tenant/profile`，正常渲染 Profile 页面
