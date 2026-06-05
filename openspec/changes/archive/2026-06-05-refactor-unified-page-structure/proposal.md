## Why

当前前端将页面按 `platform/` 和 `tenant/` 目录物理隔离，导致 Layout 组件 100% 重复、管理页面未来需要双份维护、路由守卫逻辑冗余。实际上两类角色共享相同的后台管理 UI，差异仅在登录流程和数据范围（后端已按 JWT 自动过滤）。继续在当前模式下扩展新模块（角色、菜单、分组等）将导致代码量翻倍且维护困难。

## What Changes

- **BREAKING**: 移除 `src/pages/platform/` 和 `src/pages/tenant/` 目录结构，改为按业务模块组织（`src/pages/system/`、`src/pages/dashboard/` 等）
- **BREAKING**: 合并 `PlatformLayout` 和 `TenantLayout` 为统一的 `MainLayout`，通过角色上下文动态配置
- **BREAKING**: 路由从双树隔离结构改为统一路由表 + 角色守卫控制可见性
- 登录页面保留独立（Platform 确实只有用户名+密码，Tenant 多一个租户编码字段），但移至 `src/pages/login/` 下
- Dashboard 合并为单一组件，根据角色展示差异化内容
- 现有管理页面（用户、租户、公共参数、部门）移动到新目录结构，功能不变
- 菜单系统从硬编码静态数组改为统一菜单树，通过角色标记控制可见性
- 路由配置补全缺失的面包屑条目（dept、tenant、public-param）

## Capabilities

### New Capabilities

- `unified-routing`: 统一路由架构，替代双树隔离路由。单一路由表 + 角色权限守卫，支持按角色动态过滤可访问路由
- `unified-layout`: 合并后的统一布局组件，根据当前用户角色动态渲染菜单和配置

### Modified Capabilities

- `dual-routing`: 移除双树路由隔离，改为统一路由表 + 角色守卫。路由路径保持 `/platform/*` 和 `/tenant/*` 前缀以兼容 URL，但页面组件共享
- `role-based-menu`: 菜单数据结构增加角色标记，路由守卫基于角色过滤菜单项，而非硬编码两套数组
- `page-metadata`: 补全缺失的路由配置条目（dept、tenant、public-param），面包屑路径适配新目录结构

## Impact

- **文件移动/删除**: `src/pages/platform/*`、`src/pages/tenant/*`、`src/layouts/PlatformLayout.tsx`、`src/layouts/TenantLayout.tsx`
- **新增文件**: `src/layouts/MainLayout.tsx`、`src/pages/login/` 目录、`src/pages/dashboard/`、`src/pages/system/` 下的各模块
- **修改文件**: `src/App.tsx`（路由定义重构）、`src/stores/menuStore.ts`（菜单逻辑改为统一过滤）、`src/stores/authStore.ts`（登出重定向逻辑简化）、`src/routes/config.ts`（补全条目）
- **i18n**: `layout.json` 中的菜单/面包屑 key 需适配新结构
- **Mock**: 无影响，mock 数据基于 API 端点而非页面路径
