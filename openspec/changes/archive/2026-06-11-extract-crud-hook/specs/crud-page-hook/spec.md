## ADDED Requirements

### Requirement: useCrudPage hook 封装分页 CRUD 通用逻辑

`useCrudPage<T>` hook SHALL 封装分页管理页面的通用状态和操作逻辑，接受 API 模块、列定义、搜索参数等配置，返回弹窗状态、操作函数和 DataTable 所需的 props。

#### Scenario: 基本用法

- **WHEN** 页面调用 `useCrudPage({ api: userApi, searchParams, t })` 并传入列定义
- **THEN** hook 返回 `{ modal, handlers, refresh, tableProps }`，页面可通过解构获取所有需要的状态和函数

#### Scenario: 搜索参数变化触发重新获取

- **WHEN** 页面传入的 `searchParams` 对象引用发生变化
- **THEN** hook 自动以当前 pageNo/pageSize 重新调用 `api.getPage`，更新 data 和 total

#### Scenario: 翻页触发重新获取

- **WHEN** 用户通过 tableProps 中的分页器切换页码或每页条数
- **THEN** hook 以新的 pageNo/pageSize 调用 `api.getPage`

### Requirement: useCrudPage 管理弹窗状态机

useCrudPage SHALL 管理创建/编辑弹窗的完整状态：open、mode（create/edit）、editingItem、submitting、formRef。

#### Scenario: 打开创建弹窗

- **WHEN** 调用 `handlers.handleCreate()`
- **THEN** modal.open 设为 true，modal.mode 设为 'create'，modal.editingItem 设为 null

#### Scenario: 打开编辑弹窗并加载详情

- **WHEN** 调用 `handlers.handleEdit(row)` 且 api.getById 存在
- **THEN** 调用 `api.getById(row.id)` 加载详情，modal.editingDetail 设为详情数据，modal.mode 设为 'edit'

#### Scenario: 打开编辑弹窗无 getById

- **WHEN** 调用 `handlers.handleEdit(row)` 且 api.getById 不存在
- **THEN** modal.editingDetail 直接使用 row 数据

### Requirement: useCrudPage 处理删除操作

useCrudPage SHALL 提供 handleDelete 函数，包含确认弹窗、API 调用、toast 提示和数据刷新。

#### Scenario: 删除单条记录

- **WHEN** 调用 `handlers.handleDelete(row)`
- **THEN** 弹出确认弹窗（destructive 样式），用户确认后调用 `api.remove([row.id])`，成功后显示 toast 并刷新列表

#### Scenario: 取消删除

- **WHEN** 调用 `handlers.handleDelete(row)` 后用户在确认弹窗中点击取消
- **THEN** 不调用 API，列表不变

### Requirement: useCrudPage 处理批量删除

useCrudPage SHALL 提供 handleBatchDelete 函数，通过 `onSelectedRowsChange` 回调跟踪选中行。

#### Scenario: 批量删除

- **WHEN** 调用 `handlers.handleBatchDelete()` 且有选中行
- **THEN** 弹出确认弹窗显示选中数量，用户确认后调用 `api.remove(selectedIds)`，成功后清空选中并刷新

#### Scenario: 无选中时不触发

- **WHEN** 调用 `handlers.handleBatchDelete()` 但无选中行
- **THEN** 函数直接返回，不弹窗

### Requirement: useCrudPage 返回 tableProps

useCrudPage SHALL 返回 `tableProps` 对象，包含 DataTable 渲染所需的 `fetchData` 函数（接受 `{ pageNo, pageSize }`，返回 `{ records, total }`）、`refreshKey`（数据版本号，变化时触发 DataTable 重新获取）、以及可选的 `onSelectedRowsChange` 回调（启用批量删除时）。

#### Scenario: 传递 tableProps 给 DataTable

- **WHEN** 页面将 `tableProps` 展开传给 `<DataTable {...tableProps} />`
- **THEN** DataTable 内部调用 `fetchData` 获取分页数据，searchParams 变化时 `fetchData` 引用更新触发自动重新获取

### Requirement: useCrudPage 支持配置项

useCrudPage SHALL 支持以下配置项：api（API 模块）、searchParams（搜索参数对象）、onFormSubmit（表单提交回调，接收 values 和 mode，返回 Promise）、confirmDeleteText（删除确认文案函数）、enableBatchDelete（是否启用批量删除，默认 false）。

#### Scenario: 自定义表单提交

- **WHEN** 配置 `onFormSubmit: async (values, mode) => { ... }`
- **THEN** handlers.handleFormSubmit 调用传入的回调，处理 submitting 状态和 toast

#### Scenario: 禁用批量删除

- **WHEN** 配置 `enableBatchDelete: false`（默认）
- **THEN** handlers 不包含 handleBatchDelete，tableProps 不包含 onSelectedRowsChange

### Requirement: useTreeCrudPage hook 封装树形 CRUD 通用逻辑

`useTreeCrudPage<T>` hook SHALL 封装树形管理页面（Menu、Area、Group）的通用逻辑，使用一次性获取树数据而非分页。支持可选的 `enableBatchDelete` 配置项（默认 false），与 useCrudPage 行为一致。

#### Scenario: 获取树数据

- **WHEN** hook 挂载或 dataVersion 变化
- **THEN** 调用 `api.getTree()` 获取树形数据，存储在 treeData 中

#### Scenario: 前端搜索过滤

- **WHEN** searchParams 中的某个字段有值
- **THEN** 在已获取的 treeData 上进行前端递归过滤，保留匹配节点及其祖先路径

#### Scenario: 树形页面弹窗

- **WHEN** 调用 handlers 的创建/编辑/删除函数
- **THEN** 行为与 useCrudPage 一致（弹窗状态机 + 确认弹窗 + toast + 刷新）

#### Scenario: 树形页面批量删除

- **WHEN** 配置 `enableBatchDelete: true` 且调用 `handlers.handleBatchDelete()` 且有选中行
- **THEN** 弹出确认弹窗显示选中数量，用户确认后调用 `api.remove(selectedIds)`，成功后清空选中并刷新

### Requirement: CrudPageLayout 组件统一页面布局

`CrudPageLayout` 组件 SHALL 封装管理页面的标准布局结构：页头（title + description）、搜索栏、工具栏、数据表格、表单弹窗。

#### Scenario: 基本渲染

- **WHEN** 传入 `title`、`description`、`searchSlot`、`toolbarSlot`、`table`（DataTable 或 TreeTable）、`formModal`
- **THEN** 渲染标准的管理页面布局：页头 → 搜索栏 → 工具栏 + 表格 → 弹窗

#### Scenario: 无搜索栏

- **WHEN** 不传 searchSlot
- **THEN** 不渲染搜索栏区域

#### Scenario: 无工具栏

- **WHEN** 不传 toolbarSlot
- **THEN** 不渲染工具栏区域（只读页面如 AuditLog、Log）
