## Why

UPMS 后端 API 文档已更新，覆盖 16 个资源。当前前端仅实现了 6 个（user/dept/tenant/publicParam + role/menu 仅 API 模块）。第一梯队的 6 个纯 CRUD 资源（i18n、role、oauthClient、area、menu、routeConf）可以立即画页面并对接 API，不依赖后端额外开发。其中 menu 和 area 需要树形展示，现有 DataTable 只支持平铺分页，需新建 TreeTable 组件。

## What Changes

- 新建 `TreeTable` 业务组件，支持树形数据展示、展开/折叠、列定义复用 DataTable 格式
- 新建 6 个管理页面：角色管理、菜单管理、区域管理、i18n 管理、路由配置管理、OAuth 客户端管理
- 新建对应的 API 模块（role/menu 已有，需补 area、i18n、routeConf、oauthClient）
- 新建对应的 TypeScript 类型定义
- 新建对应的 i18n 翻译文件
- 新建对应的 mock 数据
- 在路由和菜单配置中注册新页面（路由分配 platform/tenant 后续决定，先统一注册）

## Capabilities

### New Capabilities

- `tree-table`: 通用树形数据表格组件，支持展开/折叠、懒加载子节点、列定义与 DataTable 兼容
- `role-management`: 角色 CRUD 页面，含菜单权限树多选分配
- `menu-management`: 菜单 CRUD 页面，树形展示，区分菜单/按钮类型
- `area-management`: 区域 CRUD 页面，树形展示，支持按类型筛选
- `i18n-management`: 国际化 KV 管理页面，标准 CRUD
- `route-conf-management`: 网关路由配置管理页面，含 JSON 字段编辑
- `oauth-client-management`: OAuth2 客户端管理页面，含多选授权类型

### Modified Capabilities

- `crud-management-pages`: 扩展覆盖范围，新增 6 个资源的页面实现

## Non-goals

- 不决定页面的 platform/tenant 路由分配（后续单独处理）
- 不实现 app 管理和 tenantApp 订阅（第二梯队，依赖 menu tree）
- 不实现 file/fileGroup 管理（第三梯队）
- 不实现 log/auditLog（第三梯队，只读页面）
- 不修改现有 DataTable 组件，TreeTable 是独立新组件

## Approach

### 实现策略

1. **TreeTable 组件优先**：menu 和 area 依赖它，先建好再画页面
2. **按依赖顺序实现**：i18n（最简单，独立）→ role → oauthClient → area → menu → routeConf
3. **严格复用现有模式**：每个页面遵循 DeptManagement 的三文件结构（`XxxManagement.tsx` + `columns.tsx` + `xxx-form.tsx`）
4. **mock-first**：每个页面必须有对应 mock 数据，`pnpm dev` 下可跑通完整 CRUD

### TreeTable 设计要点

- 复用 `DataTableColumn<T>` 类型定义列
- 数据由父组件传入（非内部分页），支持 `children` 字段递归渲染
- 支持可选的懒加载模式（`onLoadChildren` 回调）
- 操作列、搜索栏、工具栏插槽与 DataTable 保持一致的使用体验

### 路由注册策略

先在 `App.tsx` 的 `sharedRoutes` 中注册所有新页面，`allowedRoles` 暂时设为 `['platform_admin', 'tenant_admin']`，后续再按需调整。

### 决策理由

- **TreeTable 独立组件而非 DataTable 扩展**：树形与分页是两种数据加载模式，混入 DataTable 会增加复杂度和测试负担。独立组件职责清晰，可针对树形场景优化展开/折叠交互。
- **先 i18n 后 role**：i18n 最简单且完全独立，适合先验证 pattern；role 的 menuIds 需要 menu tree 数据，但 `menuApi.getTree()` 已存在，不依赖 menu 页面。
- **mock-first**：所有页面在 mock 模式下可完整跑通 CRUD，不阻塞于后端。
