# UI Components Spec

## Purpose

可复用 UI 组件库，基于 shadcn/ui 基础组件构建 CRUD 页面所需的 DataTable、FormModal、ConfirmDialog、TreeSelect、DatePicker 等高阶组件。

## Requirements

### Requirement: 安装 shadcn UI 基础组件

项目 SHALL 通过 shadcn CLI 安装以下 UI 基础组件，确保与 base-nova 风格一致。

#### Scenario: 安装表格组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** `src/components/ui/` 目录下生成 `table.tsx`，包含 Table、TableHeader、TableBody、TableRow、TableHead、TableCell 等组件

#### Scenario: 安装表单组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 `input.tsx`、`label.tsx`、`select.tsx`、`checkbox.tsx`、`textarea.tsx`、`switch.tsx`、`form.tsx`

#### Scenario: 安装弹窗组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 `dialog.tsx`，包含 Dialog、DialogContent、DialogHeader、DialogTitle、DialogDescription、DialogFooter 等组件

#### Scenario: 安装分页组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 `pagination.tsx`，包含 Pagination、PaginationContent、PaginationItem、PaginationLink 等组件

#### Scenario: 安装反馈组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 `skeleton.tsx`、`card.tsx`、`badge.tsx`、toast 相关组件

### Requirement: 安装表单和表格引擎依赖

项目 SHALL 安装 `@tanstack/react-table`、`react-hook-form`、`@hookform/resolvers`、`zod` 作为核心依赖。

#### Scenario: 安装表格引擎

- **WHEN** 执行 pnpm install
- **THEN** `node_modules` 中包含 `@tanstack/react-table`，`package.json` 中记录依赖

#### Scenario: 安装表单引擎

- **WHEN** 执行 pnpm install
- **THEN** `node_modules` 中包含 `react-hook-form`、`@hookform/resolvers`、`zod`

### Requirement: shadcn 组件与 base-nova 风格一致

所有安装的 shadcn 组件 SHALL 使用 `@base-ui/react` 原语，遵循 base-nova 风格规范。

#### Scenario: 组件使用 data-slot 属性

- **WHEN** 查看生成的组件代码
- **THEN** 组件使用 `data-slot` 属性进行样式标记

#### Scenario: 组件使用 cn() 工具函数

- **WHEN** 查看生成的组件代码
- **THEN** 组件从 `@/lib/utils` 导入 `cn()` 进行类名合并

### Requirement: DataTable 支持服务端分页

DataTable 组件 SHALL 支持服务端分页模式，通过 `fetchData` 回调获取数据，自动管理 `pageNo`、`pageSize`、`total` 状态。

#### Scenario: 初始加载数据

- **WHEN** DataTable 组件挂载
- **THEN** 自动调用 `fetchData(pageNo=1, pageSize=10)` 获取第一页数据

#### Scenario: 翻页

- **WHEN** 用户点击分页器的第 2 页
- **THEN** 调用 `fetchData(pageNo=2, pageSize=10)` 并更新表格数据

#### Scenario: 切换每页条数

- **WHEN** 用户将每页条数从 10 改为 20
- **THEN** 调用 `fetchData(pageNo=1, pageSize=20)` 并更新表格数据

### Requirement: DataTable 支持列定义

DataTable 组件 SHALL 接受 `columns` 配置，支持自定义列标题、数据字段、渲染函数。

#### Scenario: 基础列渲染

- **WHEN** 定义 `columns=[{ key: 'username', title: '用户名' }]`
- **THEN** 表格显示"用户名"列，每行渲染对应 `row.username` 的值

#### Scenario: 自定义渲染

- **WHEN** 定义 `columns=[{ key: 'status', title: '状态', render: (val) => val ? '正常' : '锁定' }]`
- **THEN** 表格显示"状态"列，每行根据值渲染对应文本

#### Scenario: 操作列

- **WHEN** 定义 `columns=[{ key: 'actions', title: '操作', render: (_, row) => <Button>编辑</Button> }]`
- **THEN** 表格显示"操作"列，每行渲染操作按钮

### Requirement: DataTable 支持加载态和空态

DataTable 组件 SHALL 在数据加载时显示骨架屏，数据为空时显示空状态提示，请求失败时显示错误状态和重试按钮。

#### Scenario: 加载中

- **WHEN** `fetchData` 正在请求中
- **THEN** 表格区域显示 Skeleton 骨架屏

#### Scenario: 数据为空

- **WHEN** `fetchData` 返回空数组且 total 为 0
- **THEN** 表格显示空状态（使用 i18n key `common.noData`）

#### Scenario: 请求失败

- **WHEN** `fetchData` 抛出异常
- **THEN** 表格显示错误状态，包含错误图标、错误消息和"重试"按钮

#### Scenario: 重试加载

- **WHEN** 用户在错误状态下点击"重试"按钮
- **THEN** 重新调用 `fetchData`，显示 loading 骨架屏

### Requirement: DataTable 支持搜索栏和工具栏插槽

DataTable 组件 SHALL 提供 `searchSlot` 和 `toolbarSlot` 插槽，允许页面自定义搜索条件和操作按钮。

#### Scenario: 搜索栏插槽

- **WHEN** 传入 `searchSlot={<SearchForm />}`
- **THEN** 表格上方显示搜索表单组件

#### Scenario: 工具栏插槽

- **WHEN** 传入 `toolbarSlot={<Button>新增</Button>}`
- **THEN** 表格右上方显示新增按钮

### Requirement: DataTable 支持行选择

DataTable 组件 SHALL 支持行选择功能，允许用户选中多行数据用于批量操作。

#### Scenario: 选中行

- **WHEN** 用户点击行首的复选框
- **THEN** 该行被选中，`onSelectedRowsChange` 回调返回选中的行数据

#### Scenario: 全选

- **WHEN** 用户点击表头的全选复选框
- **THEN** 当前页所有行被选中

### Requirement: FormModal 支持弹窗开关

FormModal 组件 SHALL 通过 `open` 和 `onOpenChange` 控制弹窗的显示和隐藏。

#### Scenario: 打开弹窗

- **WHEN** `open` 属性设为 true
- **THEN** 弹窗显示，包含标题、表单内容区、取消/确认按钮

#### Scenario: 关闭弹窗

- **WHEN** 用户点击取消按钮或点击遮罩层
- **THEN** 调用 `onOpenChange(false)`，弹窗关闭

### Requirement: FormModal 支持新建/编辑标题切换

FormModal 组件 SHALL 根据 `mode` 属性自动切换标题，新建时显示"新增 XXX"，编辑时显示"编辑 XXX"。

#### Scenario: 新建模式

- **WHEN** `mode="create"` `title="用户"`
- **THEN** 弹窗标题显示"新增用户"

#### Scenario: 编辑模式

- **WHEN** `mode="edit"` `title="用户"`
- **THEN** 弹窗标题显示"编辑用户"

### Requirement: FormModal 支持表单提交和 loading

FormModal 组件 SHALL 在用户点击确认时触发 `onSubmit` 回调，并在提交期间显示 loading 状态。

#### Scenario: 提交表单

- **WHEN** 用户点击确认按钮
- **THEN** 调用 `onSubmit()` 回调

#### Scenario: 提交中 loading

- **WHEN** `onSubmit` 回调正在执行（返回 Promise）
- **THEN** 确认按钮显示 loading 状态，不可重复点击

#### Scenario: 提交完成后关闭

- **WHEN** `onSubmit` 成功完成（Promise resolve）
- **THEN** 弹窗自动关闭

### Requirement: FormModal 支持表单重置

FormModal 组件 SHALL 在弹窗关闭时重置表单状态，确保下次打开时表单为空或为初始值。

#### Scenario: 关闭后重置

- **WHEN** 弹窗关闭（`open` 从 true 变为 false）
- **THEN** 表单字段重置为默认值

#### Scenario: 编辑时填充初始值

- **WHEN** `mode="edit"` 且传入 `initialValues`
- **THEN** 表单字段显示初始值

### Requirement: FormModal 支持 children 表单内容

FormModal 组件 SHALL 通过 `children` 接受任意表单内容，不关心具体字段。

#### Scenario: 自定义表单内容

- **WHEN** 传入 `children={<UserForm />}`
- **THEN** 弹窗内容区渲染 UserForm 组件

### Requirement: ConfirmDialog 命令式调用

系统 SHALL 提供 `confirm()` 函数，支持在事件处理中以命令式方式弹出确认弹窗，返回 `Promise<boolean>`。

#### Scenario: 确认操作

- **WHEN** 调用 `confirm({ title: '删除确认', description: '确定要删除该用户吗？' })` 且用户点击确认按钮
- **THEN** Promise resolve 为 `true`

#### Scenario: 取消操作

- **WHEN** 调用 `confirm()` 且用户点击取消按钮或点击遮罩层
- **THEN** Promise resolve 为 `false`

### Requirement: ConfirmDialog 支持自定义内容

`confirm()` 函数 SHALL 接受 `title`、`description`、`confirmText`、`cancelText`、`variant` 参数。

#### Scenario: 危险操作样式

- **WHEN** 调用 `confirm({ variant: 'destructive', title: '删除确认' })`
- **THEN** 确认按钮显示红色危险样式

#### Scenario: 自定义按钮文案

- **WHEN** 调用 `confirm({ confirmText: '确定删除', cancelText: '再想想' })`
- **THEN** 确认按钮显示"确定删除"，取消按钮显示"再想想"

#### Scenario: 默认按钮文案

- **WHEN** 调用 `confirm({ title: '提示' })` 不传按钮文案
- **THEN** 确认按钮显示 i18n key `common.confirm`，取消按钮显示 `common.cancel`

### Requirement: ConfirmDialog 支持异步确认

确认按钮 SHALL 支持 `onConfirm` 回调，在异步操作期间禁用按钮并显示 loading。

#### Scenario: 异步确认 loading

- **WHEN** 传入 `onConfirm` 返回 Promise 且 Promise 未 resolve
- **THEN** 确认按钮显示 loading 状态，取消按钮和遮罩层点击无效

#### Scenario: 异步确认成功

- **WHEN** `onConfirm` Promise resolve
- **THEN** 弹窗关闭，`confirm()` Promise resolve 为 `true`

#### Scenario: 异步确认失败

- **WHEN** `onConfirm` Promise reject
- **THEN** 弹窗保持打开，错误通过 toast 提示

### Requirement: TreeSelect 渲染树形选项

TreeSelect 组件 SHALL 在 Popover 中渲染树形数据，支持单选。接收 `data`（树形数组）、`value`（当前选中 id）、`onChange`（选择回调）等 props。

#### Scenario: 打开树并选择节点

- **WHEN** 用户点击 TreeSelect 触发器
- **THEN** 弹出 Popover 展示树形结构，用户点击节点后关闭 Popover 并触发 onChange

#### Scenario: 显示已选值

- **WHEN** TreeSelect 已有 value 且 data 已加载
- **THEN** 触发器显示对应节点的 label 文本

#### Scenario: 空状态

- **WHEN** TreeSelect data 为空数组
- **THEN** Popover 中显示"暂无数据"提示

### Requirement: TreeSelect 支持可配置字段名

TreeSelect SHALL 通过 `labelField`（默认 'name'）、`valueField`（默认 'id'）、`childrenField`（默认 'children'）props 支持不同数据结构。

#### Scenario: 自定义字段名

- **WHEN** 传入 `labelField="label"` 的配置
- **THEN** 节点显示使用 data 中的 label 字段

### Requirement: TreeSelect 使用缩进展示层级

TreeSelect SHALL 使用缩进展示层级关系，每级增加固定 padding。

#### Scenario: 两层树渲染

- **WHEN** 数据包含父子两层
- **THEN** 子节点比父节点多一级缩进（如 padding-left 增加）

### Requirement: DatePicker 渲染 datetime-local 输入

DatePicker 组件 SHALL 封装原生 `<input type="datetime-local">`，提供 `value`（ISO string）、`onChange`（回调）props，并添加统一的样式类。

#### Scenario: 选择日期和时间

- **WHEN** 用户点击 DatePicker 输入框，选择日期和时间
- **THEN** 触发 onChange 回调，传入 ISO 格式字符串

#### Scenario: 清空值

- **WHEN** 用户清空 DatePicker 输入
- **THEN** 触发 onChange 回调，传入 undefined 或空字符串

### Requirement: DatePicker 支持 placeholder 和 disabled 状态

DatePicker SHALL 支持 `placeholder` 和 `disabled` props。

#### Scenario: Disabled 状态

- **WHEN** DatePicker 传入 `disabled={true}`
- **THEN** 输入框不可交互，显示为灰色
