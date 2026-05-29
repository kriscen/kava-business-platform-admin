## ADDED Requirements

### Requirement: DataTable 支持服务端分页

DataTable 组件 SHALL 支持服务端分页模式，通过 fetchData 回调获取数据，自动管理 pageNo、pageSize、total 状态。

#### Scenario: 初始加载数据

- **WHEN** DataTable 组件挂载
- **THEN** 自动调用 fetchData(pageNo=1, pageSize=10) 获取第一页数据

#### Scenario: 翻页

- **WHEN** 用户点击分页器的第 2 页
- **THEN** 调用 fetchData(pageNo=2, pageSize=10) 并更新表格数据

#### Scenario: 切换每页条数

- **WHEN** 用户将每页条数从 10 改为 20
- **THEN** 调用 fetchData(pageNo=1, pageSize=20) 并更新表格数据

### Requirement: DataTable 支持列定义

DataTable 组件 SHALL 接受 columns 配置，支持自定义列标题、数据字段、渲染函数。

#### Scenario: 基础列渲染

- **WHEN** 定义 columns=[{ key: 'username', title: '用户名' }]
- **THEN** 表格显示"用户名"列，每行渲染对应 row.username 的值

#### Scenario: 自定义渲染

- **WHEN** 定义 columns=[{ key: 'status', title: '状态', render: (val) => val ? '正常' : '锁定' }]
- **THEN** 表格显示"状态"列，每行根据值渲染对应文本

#### Scenario: 操作列

- **WHEN** 定义 columns=[{ key: 'actions', title: '操作', render: (_, row) => <Button>编辑</Button> }]
- **THEN** 表格显示"操作"列，每行渲染操作按钮

### Requirement: DataTable 支持加载态和空态

DataTable 组件 SHALL 在数据加载时显示骨架屏，数据为空时显示空状态提示。

#### Scenario: 加载中

- **WHEN** fetchData 正在请求中
- **THEN** 表格区域显示 Skeleton 骨架屏

#### Scenario: 数据为空

- **WHEN** fetchData 返回空数组且 total 为 0
- **THEN** 表格显示"暂无数据"空状态

### Requirement: DataTable 支持搜索栏和工具栏插槽

DataTable 组件 SHALL 提供 searchSlot 和 toolbarSlot 插槽，允许页面自定义搜索条件和操作按钮。

#### Scenario: 搜索栏插槽

- **WHEN** 传入 searchSlot={<SearchForm />}
- **THEN** 表格上方显示搜索表单组件

#### Scenario: 工具栏插槽

- **WHEN** 传入 toolbarSlot={<Button>新增</Button>}
- **THEN** 表格右上方显示新增按钮

### Requirement: DataTable 支持行选择

DataTable 组件 SHALL 支持行选择功能，允许用户选中多行数据用于批量操作。

#### Scenario: 选中行

- **WHEN** 用户点击行首的复选框
- **THEN** 该行被选中，onSelectedRowsChange 回调返回选中的行数据

#### Scenario: 全选

- **WHEN** 用户点击表头的全选复选框
- **THEN** 当前页所有行被选中
