# Unified Layout Spec

## Purpose

合并 PlatformLayout 和 TenantLayout 为单一 MainLayout，根据当前用户角色动态配置菜单和主题。

## ADDED Requirements

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
