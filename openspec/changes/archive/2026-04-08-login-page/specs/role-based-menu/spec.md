## ADDED Requirements

### Requirement: JWT 包含角色信息

登录成功后获取的 JWT payload SHALL 包含用户角色信息，用于前端动态渲染菜单。

#### Scenario: JWT 包含 platform_admin 角色

- **WHEN** 平台管理员登录成功
- **THEN** JWT payload 包含 `{ "role": "platform_admin", "username": "admin" }`

#### Scenario: JWT 包含 tenant_admin 角色

- **WHEN** 租户管理员登录成功
- **THEN** JWT payload 包含 `{ "role": "tenant_admin", "tenantCode": "DEMO", "username": "tenant" }`

### Requirement: 动态菜单渲染

系统 SHALL 根据用户角色动态渲染侧边栏菜单。

#### Scenario: 平台管理员看到所有菜单

- **WHEN** 平台管理员登录成功
- **THEN** 侧边栏显示完整菜单，包括系统管理（用户管理等）

#### Scenario: 租户管理员看到受限菜单

- **WHEN** 租户管理员登录成功
- **THEN** 侧边栏仅显示租户相关菜单，不显示系统管理-用户管理
