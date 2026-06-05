# Unified Routing Spec

## Purpose

统一路由架构，使用单一路由表替代 platform/tenant 双树隔离路由，通过角色守卫控制页面可见性。

## ADDED Requirements

### Requirement: 统一路由表

系统 SHALL 使用单一路由配置表注册所有页面路由，路由路径保持 `/platform/*` 和 `/tenant/*` 前缀以兼容 URL 书签和直觉，但页面组件由同一套代码提供。

#### Scenario: 平台管理员访问系统管理页面

- **WHEN** `platform_admin` 角色用户导航到 `/platform/system/users`
- **THEN** 系统渲染统一的 UserManagement 页面组件（来自 `src/pages/system/`）

#### Scenario: 租户管理员访问系统管理页面

- **WHEN** `tenant_admin` 角色用户导航到 `/tenant/system/users`
- **THEN** 系统渲染同一个 UserManagement 页面组件，后端 API 自动按 tenantId 过滤数据

### Requirement: 角色路由守卫

系统 SHALL 提供统一的 `RoleRoute` 守卫组件，根据路由元数据中的 `allowedRoles` 字段判断当前用户是否有权限访问。

#### Scenario: 有权限的用户访问受保护路由

- **WHEN** `platform_admin` 用户访问标记为 `allowedRoles: ['platform_admin']` 的路由 `/platform/system/tenant`
- **THEN** 正常渲染页面

#### Scenario: 无权限的用户被重定向

- **WHEN** `tenant_admin` 用户访问标记为 `allowedRoles: ['platform_admin']` 的路由 `/platform/system/tenant`
- **THEN** 系统重定向到该用户的首页（`/tenant/dashboard`）

#### Scenario: 未认证用户被重定向到对应登录页

- **WHEN** 未认证用户访问 `/platform/system/users`
- **THEN** 系统重定向到 `/platform/login`

#### Scenario: 未认证用户访问租户路由

- **WHEN** 未认证用户访问 `/tenant/system/users`
- **THEN** 系统重定向到 `/tenant/login`

### Requirement: 角色感知的路由前缀

系统 SHALL 根据当前用户角色自动解析路由前缀，使得同一页面组件在 `/platform/*` 和 `/tenant/*` 下共享。

#### Scenario: 登出时重定向到角色对应登录页

- **WHEN** `platform_admin` 用户登出
- **THEN** 重定向到 `/platform/login`

#### Scenario: 租户管理员登出

- **WHEN** `tenant_admin` 用户登出
- **THEN** 重定向到 `/tenant/login`

### Requirement: 登录页路由保持独立

登录页 SHALL 保持独立路由 `/platform/login` 和 `/tenant/login`，因为两者的表单字段和主题不同。

#### Scenario: 平台登录页渲染

- **WHEN** 用户导航到 `/platform/login`
- **THEN** 渲染 PlatformLoginPage（用户名 + 密码，蓝色主题）

#### Scenario: 租户登录页渲染

- **WHEN** 用户导航到 `/tenant/login`
- **THEN** 渲染 TenantLoginPage（用户名 + 密码 + 租户编码，绿色主题）

#### Scenario: 已认证用户访问登录页被重定向

- **WHEN** 已认证的 `platform_admin` 用户导航到 `/platform/login`
- **THEN** 重定向到 `/platform/dashboard`
