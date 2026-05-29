## Why

前端开发目前依赖后端服务才能验证功能，且两套 Mock 系统（`src/mocks/auth.ts` 和 `mock/user.ts`）并存且不一致。随着平台支持两种角色（平台管理员和租户管理员），需要一个统一的 Mock 系统和隔离的路由架构，让前端可以完全独立运行并验证所有功能点。

## What Changes

- **路由架构重构**：从单一后台拆分为 `/platform/*` 和 `/tenant/*` 两套完全隔离的后台路由
- **登录页拆分**：从 Tab 切换的单页拆分为两个独立登录页（`/platform/login` 和 `/tenant/login`）
- **Mock 系统统一**：删除 `src/mocks/auth.ts` 的直接调用，统一到 `vite-plugin-mock` 的 HTTP 拦截模式
- **菜单权限模型**：支持平台管理员固定菜单 + 租户管理员固定菜单 + 可配置的推送菜单
- **Auth Store 适配**：登录逻辑适配两套路由，根据角色跳转到对应后台

## Capabilities

### New Capabilities

- `dual-routing`: 两套隔离的后台路由架构（`/platform/*` 和 `/tenant/*`），包括独立的 Layout 和路由守卫
- `split-login`: 两个独立的登录页面，分别服务于平台管理员和租户管理员
- `unified-mock`: 统一的 Mock 系统，覆盖 auth、menu、user 等核心接口，支持两种角色的完整登录流程
- `role-based-menu`: 基于角色的菜单配置系统，支持平台管理员和租户管理员看到不同的菜单

### Modified Capabilities

（无现有 spec 需要修改）

## Impact

- **路由层**：`App.tsx` 需要重构，新增 `PlatformLayout` 和 `TenantLayout` 组件
- **登录页**：现有 `LoginPage` 拆分为两个独立页面
- **Auth Store**：`login()` 方法需要适配两套路由跳转
- **Menu Store**：菜单配置需要支持角色区分
- **Mock 系统**：删除 `src/mocks/auth.ts` 的直接调用，所有 mock 统一到 `mock/` 目录
- **类型定义**：可能需要调整 `UserInfo`、`LoginParams` 等类型以适配新架构
