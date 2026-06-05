## Context

当前项目将所有页面按角色物理隔离在 `src/pages/platform/` 和 `src/pages/tenant/` 两个目录树中，路由也分为两棵完全独立的树（`/platform/*` 和 `/tenant/*`），各自绑定独立的 Layout 组件。然而 `PlatformLayout` 和 `TenantLayout` 的代码 100% 相同，Dashboard 页面结构一致，管理页面未来必然双份。后端 API 已通过 JWT 自动按角色过滤数据范围，前端无需为不同角色维护不同的页面组件。

## Goals / Non-Goals

**Goals:**

- 合并两套 Layout 为统一的 `MainLayout`
- 页面组件按业务模块组织（`src/pages/system/`、`src/pages/dashboard/`）
- 路由使用单一配置表 + `allowedRoles` 元数据控制可见性
- 菜单从硬编码双数组改为统一数组 + 角色过滤
- 补全缺失的面包屑配置
- 保持登录页独立（Platform 和 Tenant 的表单确实不同）

**Non-Goals:**

- 不新增管理页面（角色、菜单、分组等留后续 change）
- 不修改 API 层和 Mock 层
- 不改变 URL 路径结构（仍然用 `/platform/*` 和 `/tenant/*` 前缀）
- 不修改后端接口
- 不处理部门(dept)→分组(group)的 API 路径迁移（留后续 change）

## Decisions

### D1: 页面组件放在 `src/pages/<module>/`，不按角色分目录

**选择**: `src/pages/system/UserManagement.tsx`
**放弃**: `src/pages/platform/UserManagement.tsx` + `src/pages/tenant/UserManagement.tsx`

**理由**: 后端按 JWT 自动过滤数据范围，同一页面组件可被两种角色复用。按模块组织更符合业务直觉，未来新增模块时不需要决定放 platform 还是 tenant。

### D2: 路由路径保持 `/platform/*` 和 `/tenant/*` 前缀

**选择**: 保留双前缀路由（如 `/platform/system/users` 和 `/tenant/system/users`），但映射到同一个页面组件
**放弃**: 统一为单一前缀（如 `/admin/system/users`）

**理由**: URL 前缀对用户有直觉意义（平台管理 vs 租户管理），且已有书签/外部链接依赖当前路径。保留前缀的成本只是多注册一组路由别名，收益是零迁移成本。

**实现方式**: 在 `App.tsx` 中用循环生成两组路由，共享同一组 lazy 组件引用。

### D3: 菜单数据结构改为 `allowedRoles` 数组

**选择**:

```ts
const ALL_MENUS = [
  {
    path: '/dashboard',
    labelKey: 'layout.dashboard',
    allowedRoles: ['platform_admin', 'tenant_admin'],
  },
  { path: '/system/users', labelKey: 'layout.system.users', allowedRoles: ['platform_admin'] },
  // ...
]
```

**放弃**: 两套独立的 `PLATFORM_MENUS` 和 `TENANT_MENUS` 数组

**理由**: 单一数据源更易维护，新增菜单项只需写一次并标记角色。渲染时根据当前角色过滤 + 动态拼接前缀。

### D4: Layout 合并为 `MainLayout`

**选择**: 删除 `PlatformLayout.tsx` 和 `TenantLayout.tsx`，创建 `MainLayout.tsx`
**放弃**: 保留两份并用 props 差异化

**理由**: 两份代码完全相同，没有差异化需求。菜单的差异化由 menu store 的角色过滤处理，Layout 本身不需要知道角色。

### D5: 登录页保留独立

**选择**: `src/pages/login/PlatformLoginPage.tsx` 和 `src/pages/login/TenantLoginPage.tsx`
**放弃**: 合并为一个带 props 的登录组件

**理由**: 两个登录页有实质性差异 — tenant 多一个租户编码字段、不同的主题色、不同的 i18n key。强行合并的条件分支不比两个独立文件清晰。

## Risks / Trade-offs

- **[URL 路径保持双前缀]** → 同一组件注册两次路由，内存无影响但需要维护路由表时注意同步。缓解：用循环生成路由，手动只写一次。

- **[页面组件移动]** → git 会丢失文件历史。缓解：使用 `git mv` 保留历史追踪。

- **[菜单路径动态拼接]** → 增加了运行时复杂度。缓解：拼接逻辑封装在 `getBasePath()` 工具函数中，只在一个地方处理。

- **[路由守卫需要同时检查路径前缀和角色]** → 守卫逻辑比当前稍复杂。缓解：守卫组件内部处理，对页面组件透明。

## Migration Plan

1. 创建 `MainLayout`，确保功能与现有 Layout 完全一致
2. 创建新的页面目录结构，移动现有页面组件（使用 `git mv`）
3. 重构 `App.tsx` 路由配置，使用循环生成双前缀路由
4. 重构 `menuStore`，合并双数组为统一数组 + `allowedRoles`
5. 更新 `routes/config.ts` 补全缺失的面包屑条目
6. 验证 `pnpm dev` 所有页面功能正常
7. 删除旧的 `PlatformLayout`、`TenantLayout` 和空的旧目录

回滚策略：所有变更为文件移动和重命名，git 可完整回退。
