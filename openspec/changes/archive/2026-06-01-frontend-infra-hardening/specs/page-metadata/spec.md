## MODIFIED Requirements

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
