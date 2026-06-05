# Routing System Spec

## Purpose

统一路由架构，使用单一路由表替代 platform/tenant 双树隔离路由，通过角色守卫控制页面可见性，支持路由级代码分割和 404 处理。

## Requirements

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

#### Scenario: 未认证用户访问平台路由

- **WHEN** 未认证用户访问 `/platform/system/users`
- **THEN** 系统重定向到 `/platform/login`

#### Scenario: 未认证用户访问租户路由

- **WHEN** 未认证用户访问 `/tenant/system/users`
- **THEN** 系统重定向到 `/tenant/login`

### Requirement: 角色感知的路由前缀

系统 SHALL 根据当前用户角色自动解析路由前缀，使得同一页面组件在 `/platform/*` 和 `/tenant/*` 下共享。

#### Scenario: 平台管理员登出重定向

- **WHEN** `platform_admin` 用户登出
- **THEN** 重定向到 `/platform/login`

#### Scenario: 租户管理员登出重定向

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

### Requirement: Platform 路由包含管理页面

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

### Requirement: 路由级代码分割

所有页面组件 SHALL 使用 `React.lazy()` 动态导入，实现路由级代码分割。

#### Scenario: 页面组件懒加载

- **WHEN** 应用构建
- **THEN** 每个页面组件生成独立的 chunk 文件（如 `Dashboard-[hash].js`）

#### Scenario: 首屏不加载非当前页面代码

- **WHEN** 用户访问登录页
- **THEN** 仅加载 LoginPage chunk，不加载 Dashboard、UserManagement 等页面的代码

### Requirement: Suspense loading fallback

路由切换时 SHALL 显示 Suspense fallback，避免页面空白。

#### Scenario: 加载中显示 fallback

- **WHEN** 用户导航到尚未加载的页面路由
- **THEN** 在内容区域显示居中的 loading spinner

#### Scenario: 加载完成后显示页面

- **WHEN** 页面 chunk 加载完成
- **THEN** loading fallback 消失，渲染目标页面内容

### Requirement: 404 Not Found 页面

系统 SHALL 提供 NotFound 页面，当用户访问不存在的路由时显示。

#### Scenario: 访问不存在的路径

- **WHEN** 用户访问 `/platform/unknown-path`
- **THEN** 显示 404 页面，包含错误码 "404"、提示信息和返回按钮

#### Scenario: 返回首页

- **WHEN** 用户在 404 页面点击返回按钮
- **THEN** 导航到当前角色的 Dashboard 页面

### Requirement: 通配路由匹配 NotFound

App.tsx 的通配路由 SHALL 渲染 NotFound 页面，而非静默重定向。

#### Scenario: 未匹配路径显示 404

- **WHEN** URL 不匹配任何已定义路由
- **THEN** 渲染 NotFound 组件

#### Scenario: 已认证用户看到返回首页

- **WHEN** 已认证用户访问不存在的路径
- **THEN** 404 页面显示"返回首页"按钮，点击后跳转到对应角色的 Dashboard
