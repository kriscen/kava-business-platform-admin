## ADDED Requirements

### Requirement: Dept management page renders paginated dept list

系统 SHALL 展示部门分页列表，包含列：部门名称 (name)、上级部门 (parentName)、排序 (sortOrder)、创建时间 (gmtCreate)、操作（编辑/删除）。

#### Scenario: Initial page load

- **WHEN** 用户访问 `/platform/system/dept`
- **THEN** 系统调用 `GET /api/v1/sys/dept/page?pageNo=1&pageSize=10` 并展示分页表格

#### Scenario: Search by name

- **WHEN** 用户在搜索栏输入部门名称并触发搜索
- **THEN** 系统调用 `GET /api/v1/sys/dept/page?name={keyword}` 并展示过滤结果

### Requirement: Dept create form with tree-select for parent

系统 SHALL 提供部门创建表单，包含字段：部门名称 (name, 必填)、上级部门 (pid, tree-select)、排序 (sortOrder)。pid 通过调用 `GET /api/v1/sys/dept/tree` 获取树形数据。

#### Scenario: Create dept with parent selection

- **WHEN** 用户点击"新增"按钮，填写部门名称，从 tree-select 选择上级部门，点击确认
- **THEN** 系统调用 `POST /api/v1/sys/dept` 发送 `{ name, pid, sortOrder }`，成功后刷新列表

#### Scenario: Create dept without parent

- **WHEN** 用户创建部门时不选择上级部门
- **THEN** 系统发送 `pid` 为空，代表顶级部门

### Requirement: Dept edit form

系统 SHALL 提供部门编辑表单，预填当前部门信息。调用 `PUT /api/v1/sys/dept/{id}` 更新。

#### Scenario: Edit dept name

- **WHEN** 用户点击某行的编辑按钮，修改部门名称，点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/dept/{id}` 发送更新数据，成功后刷新列表

### Requirement: Dept batch delete

系统 SHALL 支持批量删除部门，通过 `DELETE /api/v1/sys/dept` 发送 ID 数组。

#### Scenario: Batch delete selected depts

- **WHEN** 用户勾选多个部门行，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/dept` 发送选中 ID 数组，成功后刷新列表

### Requirement: Dept i18n support

部门页面所有用户可见字符串 SHALL 通过 i18n `t()` 函数引用 `dept.*` 命名空间的翻译 key。

#### Scenario: All labels use i18n

- **WHEN** 部门页面渲染时
- **THEN** 表头、按钮文字、搜索标签、提示消息均通过 `t('dept.xxx')` 引用
