## 1. MainLayout 创建

- [x] 1.1 创建 `src/layouts/MainLayout.tsx`，合并 PlatformLayout 和 TenantLayout 的完整逻辑（sidebar collapse、header、content、buildMenus 调用）
- [x] 1.2 验证 MainLayout 在 `pnpm dev` 下正常渲染（手动切换 platform/tenant 登录确认）

## 2. 菜单 Store 重构

- [x] 2.1 将 `menuStore` 中的 `PLATFORM_MENUS` 和 `TENANT_MENUS` 合并为统一的 `ALL_MENUS` 数组，每项添加 `allowedRoles` 字段
- [x] 2.2 实现 `buildMenus()` 基于 `authStore.userInfo.role` 过滤 `ALL_MENUS`
- [x] 2.3 菜单项的 `path` 改为相对路径，渲染时通过 `getBasePath(role)` 拼接前缀

## 3. 页面组件迁移

- [x] 3.1 创建目标目录 `src/pages/login/`、`src/pages/dashboard/`、`src/pages/system/`
- [x] 3.2 `git mv` 登录页：`platform/LoginPage.tsx` → `login/PlatformLoginPage.tsx`，`tenant/LoginPage.tsx` → `login/TenantLoginPage.tsx`（更新内部 import）
- [x] 3.3 `git mv` Dashboard：`platform/Dashboard.tsx` → `dashboard/Dashboard.tsx`（更新内部 import）
- [x] 3.4 `git mv` 用户管理：`platform/UserManagement.tsx` + `users/` 子目录 → `system/UserManagement.tsx` + `system/users/` 子目录
- [x] 3.5 `git mv` 租户管理：`platform/tenant/` → `system/tenant/`
- [x] 3.6 `git mv` 公共参数：`platform/public-param/` → `system/public-param/`
- [x] 3.7 `git mv` 部门管理：`platform/dept/` → `system/dept/`
- [x] 3.8 `git mv` 租户端 Dashboard：`tenant/Dashboard.tsx` → 合并到 `dashboard/Dashboard.tsx`（根据 role 条件渲染）
- [x] 3.9 `git mv` 租户端 Profile：`tenant/Profile.tsx` → `system/Profile.tsx` 或 `dashboard/Profile.tsx`

## 4. 路由重构

- [x] 4.1 在 `App.tsx` 中定义共享的 lazy 组件引用映射表（路径 → lazy component）
- [x] 4.2 用循环生成 `/platform/*` 和 `/tenant/*` 两组路由，共用同一组 lazy 组件，外层包裹 `MainLayout`
- [x] 4.3 登录路由保持独立，不包裹 MainLayout
- [x] 4.4 `RoleRoute` 守卫改为读取路由元数据 `allowedRoles` 判断权限，不再硬编码角色

## 5. 面包屑 & 元数据补全

- [x] 5.1 在 `src/routes/config.ts` 补全缺失条目：`/platform/system/dept`、`/platform/system/tenant`、`/platform/system/public-param` 及对应的 `/tenant/` 路径
- [x] 5.2 验证面包屑在所有页面正确显示

## 6. 清理 & 验证

- [x] 6.1 删除 `src/layouts/PlatformLayout.tsx` 和 `src/layouts/TenantLayout.tsx`
- [x] 6.2 删除空的 `src/pages/platform/` 和 `src/pages/tenant/` 目录
- [x] 6.3 全局搜索确认无残留的旧 Layout import 和旧目录引用
- [x] 6.4 `pnpm dev` 完整验证：platform 登录 → 所有管理页面 → 登出 → tenant 登录 → 所有可用页面 → 登出
- [x] 6.5 `pnpm type-check` 无错误
- [x] 6.6 `pnpm lint` 无新增错误
