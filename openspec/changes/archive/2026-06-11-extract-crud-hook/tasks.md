## 1. Hook 基础设施

- [x] 1.1 创建 `src/hooks/useCrudPage.ts`，实现分页 CRUD hook 的核心逻辑：searchParams 驱动的 fetchData、pageNo/pageSize 状态管理、data/total/loading/error 状态
- [x] 1.2 在 useCrudPage 中实现弹窗状态机：modal (open/mode/editingItem/editingDetail/submitting/formRef)、handlers (handleCreate/handleEdit/handleFormSubmit)
- [x] 1.3 在 useCrudPage 中实现删除逻辑：handleDelete（确认弹窗 + API 调用 + toast + 刷新）、handleBatchDelete（选中行管理 + 确认 + 批量删除）
- [x] 1.4 在 useCrudPage 中实现 tableProps 输出：将 data/total/loading/error/pageNo/pageSize 封装为 DataTable 可直接消费的 props 对象
- [x] 1.5 创建 `src/hooks/useTreeCrudPage.ts`，复用 useCrudPage 的弹窗和删除逻辑，替换分页获取为 getTree + 前端过滤

## 2. 布局组件

- [x] 2.1 创建 `src/components/crud-page-layout.tsx`，封装页头（title + description）、搜索栏、工具栏、表格区域、FormModal 的标准布局结构

## 3. 分页页面重构（每页验证 mock 模式 CRUD 流程）

- [x] 3.1 重构 `src/pages/system/users/UserManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.2 重构 `src/pages/system/role/RoleManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.3 重构 `src/pages/system/tenant/TenantManagement.tsx` 使用 useCrudPage + CrudPageLayout（注意启用/禁用操作作为额外 handlers）
- [x] 3.4 重构 `src/pages/system/public-param/PublicParamManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.5 重构 `src/pages/system/i18n/I18nManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.6 重构 `src/pages/system/route-conf/RouteConfManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.7 重构 `src/pages/system/oauth-client/OAuthClientManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.8 重构 `src/pages/system/file/FileManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.9 重构 `src/pages/system/file-group/FileGroupManagement.tsx` 使用 useCrudPage + CrudPageLayout
- [x] 3.10 重构 `src/pages/system/app/AppManagement.tsx` 使用 useCrudPage + CrudPageLayout（注意绑定菜单作为额外操作）
- [x] 3.11 重构 `src/pages/system/audit-log/AuditLogManagement.tsx` 使用 useCrudPage（只读模式，无 CRUD 操作）
- [x] 3.12 重构 `src/pages/system/log/LogManagement.tsx` 使用 useCrudPage（只读模式，无 CRUD 操作）

## 4. 树形页面重构

- [x] 4.1 重构 `src/pages/system/menu/MenuManagement.tsx` 使用 useTreeCrudPage + CrudPageLayout
- [x] 4.2 重构 `src/pages/system/area/AreaManagement.tsx` 使用 useTreeCrudPage + CrudPageLayout
- [x] 4.3 重构 `src/pages/system/group/GroupManagement.tsx` 使用 useTreeCrudPage + CrudPageLayout

## 5. 验证与清理

- [x] 5.1 运行 `pnpm type-check` 确认无类型错误
- [x] 5.2 运行 `pnpm dev` 验证所有管理页面在 mock 模式下可正常加载、搜索、翻页、新增、编辑、删除
- [x] 5.3 确认无未使用的 import 和变量，运行 `pnpm lint`
