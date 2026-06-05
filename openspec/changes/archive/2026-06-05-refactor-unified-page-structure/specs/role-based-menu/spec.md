# Role-Based Menu Spec — Delta

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Platform admin sees platform-specific menu items

**Reason**: 合并为统一的菜单配置，通过 `allowedRoles` 过滤。不再需要独立的 platform 菜单硬编码。

**Migration**: `PLATFORM_MENUS` 常量 SHALL 被合并到统一的 `ALL_MENUS` 数组中，每个项添加 `allowedRoles: ['platform_admin']`。

### Requirement: Tenant admin sees tenant-specific menu items

**Reason**: 同上。

**Migration**: `TENANT_MENUS` 常量 SHALL 被合并到统一的 `ALL_MENUS` 数组中，每个项添加 `allowedRoles: ['tenant_admin']`。

### Requirement: Menu items have correct routing paths

**Reason**: 路径前缀策略不变，但菜单路径 SHALL 通过 `getBasePath()` 工具函数动态生成，而非硬编码。

**Migration**: 菜单项的 `path` 字段改为相对路径（如 `/system/users`），渲染时根据角色拼接前缀（`/platform` 或 `/tenant`）。
