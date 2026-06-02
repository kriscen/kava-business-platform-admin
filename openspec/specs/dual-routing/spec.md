# Dual Routing Spec

## Purpose

Platform and tenant admin route isolation with dedicated layouts and role-based access control.

## Requirements

### Requirement: Platform admin routes are isolated

The system SHALL provide a dedicated route namespace `/platform/*` for platform admin pages, with its own Layout component.

#### Scenario: Platform admin accesses platform routes

- **WHEN** a user with `platform_admin` role navigates to `/platform/dashboard`
- **THEN** the system renders the `PlatformLayout` with the dashboard page

#### Scenario: Tenant admin is blocked from platform routes

- **WHEN** a user with `tenant_admin` role navigates to `/platform/dashboard`
- **THEN** the system redirects to `/tenant/dashboard`

### Requirement: Tenant admin routes are isolated

The system SHALL provide a dedicated route namespace `/tenant/*` for tenant admin pages, with its own Layout component.

#### Scenario: Tenant admin accesses tenant routes

- **WHEN** a user with `tenant_admin` role navigates to `/tenant/dashboard`
- **THEN** the system renders the `TenantLayout` with the dashboard page

#### Scenario: Platform admin is blocked from tenant routes

- **WHEN** a user with `platform_admin` role navigates to `/tenant/dashboard`
- **THEN** the system redirects to `/platform/dashboard`

### Requirement: Unauthenticated users are redirected to login

The system SHALL redirect unauthenticated users to the appropriate login page based on the route they attempted to access.

#### Scenario: Unauthenticated user accesses platform route

- **WHEN** an unauthenticated user navigates to `/platform/dashboard`
- **THEN** the system redirects to `/platform/login`

#### Scenario: Unauthenticated user accesses tenant route

- **WHEN** an unauthenticated user navigates to `/tenant/dashboard`
- **THEN** the system redirects to `/tenant/login`

### Requirement: Platform Layout provides admin navigation

The `PlatformLayout` SHALL render a sidebar with platform admin menu items and a header with user info and logout.

#### Scenario: Platform Layout renders correctly

- **WHEN** a platform admin is authenticated and on any `/platform/*` route
- **THEN** the system shows a sidebar with platform admin menu items, a header with username, and a logout button

### Requirement: Tenant Layout provides tenant navigation

The `TenantLayout` SHALL render a sidebar with tenant admin menu items and a header with user info and logout.

#### Scenario: Tenant Layout renders correctly

- **WHEN** a tenant admin is authenticated and on any `/tenant/*` route
- **THEN** the system shows a sidebar with tenant admin menu items, a header with username, and a logout button

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
