## MODIFIED Requirements

### Requirement: Platform routes include new management pages

系统 SHALL 在 platform 路由下注册三个新页面路由，使用 React.lazy 懒加载，并添加对应的菜单项。

#### Scenario: Access dept management

- **WHEN** platform_admin 访问 `/platform/system/dept`
- **THEN** 渲染 DeptManagement 页面，侧边栏显示"部门管理"菜单项

#### Scenario: Access tenant management

- **WHEN** platform_admin 访问 `/platform/system/tenant`
- **THEN** 渲染 TenantManagement 页面，侧边栏显示"租户管理"菜单项

#### Scenario: Access public param management

- **WHEN** platform_admin 访问 `/platform/system/public-param`
- **THEN** 渲染 PublicParamManagement 页面，侧边栏显示"公共参数"菜单项
