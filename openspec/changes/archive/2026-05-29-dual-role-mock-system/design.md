## Context

当前项目状态：

- 单一路由结构，所有页面在同一个 Layout 下
- 登录页通过 Tab 切换支持平台管理员和租户管理员
- 两套 Mock 系统并存且不一致（`src/mocks/auth.ts` 直接调用 vs `mock/user.ts` HTTP 拦截）
- 菜单配置在 `menuStore.ts` 中硬编码，按角色过滤

技术栈：React 19 + TypeScript + Vite 8 + Zustand + React Router DOM 7 + vite-plugin-mock

## Goals / Non-Goals

**Goals:**

- 前端完全独立于后端运行，可验证所有功能点
- 两套隔离的后台路由（`/platform/*` 和 `/tenant/*`）
- 两个独立的登录页面
- 统一的 Mock 系统覆盖核心接口
- 基于角色的菜单配置

**Non-Goals:**

- 菜单推送功能（平台管理员推送给租户）— 后续后端配置实现
- 完整的业务接口 Mock — 分阶段补充
- 数据权限隔离 — 后续实现
- 生产环境的认证流程变更 — 仅影响 Mock 模式

## Decisions

### 1. 路由架构：两套完全隔离的后台

**选择**：`/platform/*` 和 `/tenant/*` 两套路由，各自有独立的 Layout

**替代方案**：

- 共享 Layout + 动态菜单：复用同一个 Layout 组件，根据角色切换菜单
- 选中隔离方案的原因：
  - 两种角色的功能差异可能越来越大
  - 隔离的 Layout 可以独立演进，互不影响
  - 路由守卫更清晰，平台路由不会意外暴露给租户

**实现思路**：

```
src/
├── layouts/
│   ├── PlatformLayout.tsx    # 平台后台 Layout
│   └── TenantLayout.tsx      # 租户后台 Layout
├── pages/
│   ├── platform/
│   │   ├── LoginPage.tsx     # 平台登录
│   │   ├── Dashboard.tsx
│   │   └── ...
│   └── tenant/
│       ├── LoginPage.tsx     # 租户登录
│       ├── Dashboard.tsx
│       └── ...
```

### 2. Mock 系统：统一到 vite-plugin-mock

**选择**：删除 `src/mocks/auth.ts` 的直接调用，所有 Mock 统一到 `mock/` 目录，通过 HTTP 拦截实现

**替代方案**：

- 保留函数级 Mock + HTTP Mock 并存
- 选中统一方案的原因：
  - 消除两套系统不一致的问题
  - 所有 API 调用走统一路径，Mock 和真实环境行为一致
  - 便于后续按模块补充 Mock 数据

**实现思路**：

- 删除 `src/mocks/auth.ts` 中的 `mockLogin()` 直接调用
- 在 `mock/` 目录新增 `auth.ts`，提供 `/api/auth/login`、`/api/auth/logout`、`/api/auth/refresh` 等接口
- Auth Store 的 `login()` 方法改为调用 Axios，由 vite-plugin-mock 拦截

### 3. 登录流程：独立页面 + 角色路由

**选择**：两个独立登录页，登录成功后根据角色跳转到对应后台

**实现思路**：

- `/platform/login` — 平台管理员登录表单（username + password）
- `/tenant/login` — 租户管理员登录表单（username + password + tenantCode）
- 登录成功后：
  - `platform_admin` → `/platform/dashboard`
  - `tenant_admin` → `/tenant/dashboard`
- 路由守卫检查：
  - `/platform/*` 路由只允许 `platform_admin` 访问
  - `/tenant/*` 路由只允许 `tenant_admin` 访问

### 4. 菜单配置：角色区分 + Mock 数据

**选择**：菜单配置按角色分开定义，先用 Mock 数据，后续接入后端接口

**实现思路**：

- `menuStore.ts` 中定义两套菜单配置
- Mock 接口 `/api/menu/list` 根据当前用户角色返回对应菜单
- 后续接入后端时，只需将 Mock 替换为真实接口

## Risks / Trade-offs

- **[路由重构影响范围大]** → 先搭建路由骨架，逐步迁移现有页面，保持功能不丢失
- **[Mock 数据可能与后端不一致]** → Mock 数据结构对齐已有的 TypeScript 类型定义，后续接入后端时对比调整
- **[两套 Layout 可能有重复代码]** → 共用组件抽取到 `components/common/`，Layout 只负责结构差异

## Open Questions

- 租户管理员的具体菜单列表（固定部分）需要后续确认
- 平台管理员的完整功能列表需要后续确认
- 菜单推送功能的后端接口设计待定
