## 1. Mock 系统统一

- [x] 1.1 在 `mock/` 目录创建 `auth.ts`，提供 `/api/auth/login`、`/api/auth/logout`、`/api/auth/refresh` 接口
- [x] 1.2 在 `mock/` 目录创建 `menu.ts`，提供 `/api/menu/list` 接口，根据角色返回不同菜单
- [x] 1.3 更新 `mock/index.ts`，导出新增的 mock 模块
- [x] 1.4 删除 `src/mocks/auth.ts` 中的 `mockLogin()` 直接调用逻辑

## 2. Auth Store 重构

- [x] 2.1 修改 `authStore.ts` 的 `login()` 方法，改为调用 Axios POST `/api/auth/login`
- [x] 2.2 修改 `authStore.ts` 的 `logout()` 方法，改为调用 Axios POST `/api/auth/logout`
- [x] 2.3 添加 token 刷新逻辑，调用 `/api/auth/refresh`
- [x] 2.4 更新 `login()` 的跳转逻辑，根据角色跳转到 `/platform/dashboard` 或 `/tenant/dashboard`

## 3. 路由架构重构

- [x] 3.1 创建 `PlatformLayout` 组件（侧边栏 + 头部 + 内容区）
- [x] 3.2 创建 `TenantLayout` 组件（侧边栏 + 头部 + 内容区）
- [x] 3.3 重构 `App.tsx`，添加 `/platform/*` 和 `/tenant/*` 两套路由
- [x] 3.4 实现 `PlatformRoute` 路由守卫，只允许 `platform_admin` 访问
- [x] 3.5 实现 `TenantRoute` 路由守卫，只允许 `tenant_admin` 访问
- [x] 3.6 处理根路径 `/` 的重定向逻辑（根据认证状态和角色）

## 4. 登录页拆分

- [x] 4.1 创建 `pages/platform/LoginPage.tsx`（username + password）
- [x] 4.2 创建 `pages/tenant/LoginPage.tsx`（username + password + tenantCode）
- [x] 4.3 实现登录页的认证状态检查（已登录则重定向到对应 dashboard）
- [x] 4.4 删除或重构原有的 `pages/LoginPage/index.tsx`

## 5. 菜单系统重构

- [x] 5.1 重构 `menuStore.ts`，支持按角色获取菜单
- [x] 5.2 实现 `getMenuByRole()` 方法，返回对应角色的菜单配置
- [x] 5.3 更新菜单路径，平台菜单使用 `/platform/` 前缀，租户菜单使用 `/tenant/` 前缀
- [x] 5.4 在 `PlatformLayout` 和 `TenantLayout` 中集成菜单渲染

## 6. 页面迁移

- [x] 6.1 将现有页面迁移到 `pages/platform/` 目录
- [x] 6.2 创建 `pages/tenant/Dashboard.tsx`（租户仪表盘）
- [x] 6.3 创建 `pages/tenant/Profile.tsx`（个人信息页）
- [x] 6.4 确保所有页面在新路由结构下可正常访问

## 7. 测试验证

- [x] 7.1 验证平台管理员登录流程（登录 → 跳转 → 看到菜单 → 可导航）
- [x] 7.2 验证租户管理员登录流程（登录 → 跳转 → 看到菜单 → 可导航）
- [x] 7.3 验证路由隔离（角色 A 不能访问角色 B 的路由）
- [x] 7.4 验证 Mock 模式下所有功能正常（`pnpm dev`）
