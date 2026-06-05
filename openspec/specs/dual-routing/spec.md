# Dual Routing Spec

## Purpose

Platform and tenant admin route isolation with unified layout and role-based access control.

## Requirements

### Requirement: Platform admin routes are isolated

The system SHALL provide routes under `/platform/*` for platform admin pages, using the unified `MainLayout` component. Route isolation is achieved via role-based guard on route metadata, not via separate layout components.

#### Scenario: Platform admin accesses platform routes

- **WHEN** a user with `platform_admin` role navigates to `/platform/dashboard`
- **THEN** the system renders the `MainLayout` with the dashboard page and platform menu

#### Scenario: Tenant admin is blocked from platform routes

- **WHEN** a user with `tenant_admin` role navigates to `/platform/dashboard`
- **THEN** the system redirects to `/tenant/dashboard`

### Requirement: Tenant admin routes are isolated

The system SHALL provide routes under `/tenant/*` for tenant admin pages, using the unified `MainLayout` component. Route isolation is achieved via role-based guard, not via separate layout components.

#### Scenario: Tenant admin accesses tenant routes

- **WHEN** a user with `tenant_admin` role navigates to `/tenant/dashboard`
- **THEN** the system renders the `MainLayout` with the dashboard page and tenant menu

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

### Requirement: Platform routes include management pages

系统 SHALL 在 platform 路由下注册管理页面路由，使用 React.lazy 懒加载，并添加对应的菜单项。

#### Scenario: Access dept management

- **WHEN** platform_admin 访问 `/platform/system/dept`
- **THEN** 渲染 DeptManagement 页面，侧边栏显示"部门管理"菜单项

#### Scenario: Access tenant management

- **WHEN** platform_admin 访问 `/platform/system/tenant`
- **THEN** 渲染 TenantManagement 页面，侧边栏显示"租户管理"菜单项

#### Scenario: Access public param management

- **WHEN** platform_admin 访问 `/platform/system/public-param`
- **THEN** 渲染 PublicParamManagement 页面，侧边栏显示"公共参数"菜单项
