# Page Metadata Spec

## Purpose

集中管理路由元数据，提供动态页面标题和面包屑功能。

## Requirements

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
