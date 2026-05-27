## Context

当前前端在 mock 模式下可运行，但与真实后端存在三处不对齐：(1) 类型系统 — `ApiResponse.code` 是 `number`/`message` 而后端是 `string`/`msg`；(2) API 层无模块化，调用散落各处；(3) 错误仅 console.error，用户无感知。此外 token 刷新存在两条路径（interceptors 用 raw fetch，authStore 用 request），存在循环风险。

后端 API 文档已就绪（docs/04-frontend/auth-api.md、upms-api.md），定义了 13+ REST 资源和 OAuth2 认证流程。

## Goals / Non-Goals

**Goals:**

- ApiResponse 类型与后端 JsonResult 完全对齐（`code: string`、`msg`）
- 提供完整的分页类型（PagingInfo、PageQuery）和核心实体类型
- 建立模块化 API 层骨架，后续模块对接只需填空
- 拦截器接入 toast，用户可感知 HTTP 和业务错误
- 统一 token 刷新为单一路径（raw fetch）

**Non-Goals:**

- 不实现具体业务页面（Dashboard、UserManagement 等）
- 不接入动态菜单加载（属于独立 change）
- 不实现按钮级权限控制（属于独立 change）
- 不新增英文 locale
- 不实现路由懒加载

## Decisions

### D1: ApiResponse 字段对齐策略

**选择**: 直接修改 `ApiResponse` 类型定义，不兼容旧字段。

`code: number` → `code: string`，`message` → `msg`。

**理由**: 项目尚在开发阶段，没有外部消费者。双字段兼容方案增加认知负担但无实际收益。

**影响范围**: `interceptors.ts` 中 `data.code !== 0` 改为 `data.code !== '0'`；所有引用 `.message` 的地方改为 `.msg`。

### D2: API 模块组织方式

**选择**: 按后端资源模块组织，每个模块导出函数。

```
src/api/
├── request.ts           # 已有
├── interceptors.ts      # 已有
├── index.ts             # 已有
├── auth.ts              # OAuth2 token 端点
└── modules/
    ├── user.ts          # 用户 CRUD + 分页
    ├── role.ts          # 角色 CRUD + 下拉
    ├── menu.ts          # 菜单 CRUD + 树
    ├── dept.ts          # 部门 CRUD + 树
    └── tenant.ts        # 租户 CRUD + 启停
```

每个模块导出同名函数，如 `userApi.getPage(query)`、`userApi.create(data)`。

**备选方案**: (A) 按功能域组织（auth/、system/）— 层级过深；(B) 单文件全量导出 — 不可维护。选择按资源模块单层平铺，简洁且与后端一一对应。

### D3: Toast 组件选型

**选择**: shadcn/ui 的 Sonner（toast 库）。

**理由**: 项目已使用 shadcn/ui，Sonner 是其推荐的 toast 方案，集成简单，支持 `toast()`、`toast.error()`、`toast.success()` 等 API。

**接入方式**: 在 `App.tsx` 根组件添加 `<Toaster />`，拦截器中直接调用 `toast.error(msg)`。

### D4: Token 刷新统一路径

**选择**: 保留 interceptors.ts 中的 raw fetch 实现，移除 authStore.refreshAccessToken()。

**理由**: raw fetch 是正确做法（避免拦截器循环）。authStore 中的 `refreshAccessToken` 方法使用 `request` 封装，如果 refresh_token 过期返回 401 会再次触发拦截器，形成无限循环。

**改动**: authStore 中删除 `refreshAccessToken` 方法定义。interceptors.ts 中的刷新逻辑已经是完整实现，包括并发队列和失败重定向。

### D5: 实体类型定义方式

**选择**: 按后端资源分文件，放在 `src/types/` 下。

```
src/types/
├── api.ts          # 已有 → 修改 (ApiResponse 对齐)
├── error.ts        # 已有
├── layout.ts       # 已有
├── common.ts       # 新增: PageQuery, PagingInfo, IdParam 等
├── user.ts         # 新增: SysUserRequest/Response
├── role.ts         # 新增: SysRoleRequest/Response
├── menu.ts         # 新增: SysMenuRequest/Response
├── dept.ts         # 新增: SysDeptRequest/Response
└── tenant.ts       # 新增: SysTenantRequest/Response
```

**备选方案**: 单文件 `entities.ts` — 后续对接 13+ 资源会变得臃肿。分文件更好维护。

## Risks / Trade-offs

- **[Breaking change]** ApiResponse 字段变更会影响所有引用代码 → 影响范围小，grep 即可找到所有引用点，一次性修改
- **[过度设计风险]** 实体类型提前定义但可能与后端实际返回有差异 → 以 docs/04-frontend/upms-api.md 为准，后端文档已是最新；后续对接时可微调
- **[模块未使用]** API 模块骨架建好后，部分模块暂无调用方 → 这是预期行为，骨架为后续对接提供结构
