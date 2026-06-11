## Context

当前 Sidebar 的 `iconMap` 只有 `LayoutDashboard`、`Settings`、`User` 三个图标，而 `menuStore` 的 `ALL_MENUS` 中顶级菜单使用了 icon 字段，但子菜单全部没有 icon。此外 `ALL_MENUS` 缺少 `group`（分组管理）条目，但 `App.tsx` 路由已注册 `system/group`。Dashboard 页面是两行占位文字。Profile 路由只允许 `tenant_admin`，但 Header 下拉菜单所有角色都可见。

## Goals / Non-Goals

**Goals:**

- 补全 Sidebar iconMap，覆盖当前所有菜单项需要的图标
- menuStore ALL_MENUS 补全 group 条目
- Dashboard 改为角色感知的欢迎页，含快捷入口
- Profile 路由对齐：platform_admin 也能访问

**Non-Goals:**

- 不做后端动态菜单（从 API 拉取菜单树），继续使用前端 ALL_MENUS 静态配置
- 不做 Dashboard 统计图表/数据看板
- 不改变 Sidebar 折叠/展开交互逻辑

## Decisions

### 1. iconMap 静态映射 + 扩展

**决定**：在 Sidebar 中维护一个静态 `iconMap` 对象，手动映射图标名称到 lucide-react 组件。

**理由**：当前菜单配置是前端静态的（`ALL_MENUS`），图标名称也是前端约定的。引入动态加载（如 `lucide-react` 动态 import）增加复杂度但现阶段无收益。

**扩展方式**：为每个子菜单项也分配合理的图标，并预留一些常用图标（如 Shield、FileText、Globe 等）。具体映射：

| 菜单项       | 图标            |
| ------------ | --------------- |
| Dashboard    | LayoutDashboard |
| 系统管理     | Settings        |
| 用户管理     | Users           |
| 租户管理     | Building2       |
| 公共参数     | Wrench          |
| 角色管理     | Shield          |
| 菜单管理     | Menu            |
| 区域管理     | MapPin          |
| 国际化       | Globe           |
| 路由配置     | Route           |
| OAuth 客户端 | KeyRound        |
| 日志管理     | FileText        |
| 审计日志     | ClipboardList   |
| 文件管理     | File            |
| 文件分组     | FolderOpen      |
| 应用管理     | AppWindow       |
| 分组管理     | Group           |
| 个人信息     | User            |

### 2. menuStore ALL_MENUS 补全

**决定**：在 `system` 分组的 `children` 中添加 group 条目，`allowedRoles: ['platform_admin']`，与路由和页面一致。

### 3. Dashboard 欢迎页结构

**决定**：欢迎页包含：

- 顶部问候区：`你好，{username}` + 当前日期
- 快捷入口卡片网格：根据角色显示不同的入口卡片，每个卡片含图标、标题、描述，点击跳转到对应管理页面

**平台管理员入口**：用户管理、租户管理、应用管理、角色管理
**租户管理员入口**：角色管理、菜单管理、应用管理（OAuth 客户端）、个人设置

### 4. Profile 路由对齐

**决定**：将 Profile 路由的 `allowedRoles` 从 `['tenant_admin']` 改为 `['platform_admin', 'tenant_admin']`，同时在 menuStore 的 ALL_MENUS 中也给 platform_admin 加上 profile 条目。

**理由**：Header 下拉菜单已经对所有角色显示"个人信息"入口，点击后平台管理员会跳走，体验不一致。

## Risks / Trade-offs

- **图标名称硬编码** → 如果未来切换到后端动态菜单，需要约定图标名称规范。当前风险低，因为菜单完全前端控制。
- **快捷入口硬编码** → 欢迎页的快捷入口是按角色静态配置的，不是从菜单动态生成的。理由：快捷入口是精选的最常用功能，不是所有菜单的镜像。
