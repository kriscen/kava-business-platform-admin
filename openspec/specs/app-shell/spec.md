# App Shell Spec

## Purpose

统一布局系统和路由架构，合并 PlatformLayout 和 TenantLayout 为单一 MainLayout，通过角色标记动态过滤菜单，并集中管理路由元数据（页面标题和面包屑）。使用单一路由表替代 platform/tenant 双树隔离路由，通过角色守卫控制页面可见性，支持路由级代码分割和 404 处理。

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
