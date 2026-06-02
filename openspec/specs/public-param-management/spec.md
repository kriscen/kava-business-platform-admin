## Requirements

### Requirement: PublicParam management page renders paginated list

系统 SHALL 展示公共参数分页列表，包含列：参数名称 (publicName)、参数键 (publicKey)、参数值 (publicValue)、状态 (status)、参数类型 (publicType)、系统标识 (systemFlag)、操作（编辑/删除）。

#### Scenario: Initial page load

- **WHEN** 用户访问 `/platform/system/public-param`
- **THEN** 系统调用 `GET /api/v1/sys/public-param/page?pageNo=1&pageSize=10` 并展示分页表格

#### Scenario: Search by name and key

- **WHEN** 用户在搜索栏输入参数名称和参数键
- **THEN** 系统调用 `GET /api/v1/sys/public-param/page?publicName={name}&publicKey={key}` 并展示过滤结果

### Requirement: PublicParam create form

系统 SHALL 提供公共参数创建表单，包含字段：参数名称 (publicName, 必填)、参数键 (publicKey, 必填)、参数值 (publicValue, 必填)、状态 (status)、参数类型 (publicType)、系统标识 (systemFlag)。

#### Scenario: Create public param

- **WHEN** 用户填写参数信息并点击确认
- **THEN** 系统调用 `POST /api/v1/sys/public-param` 发送数据，成功后刷新列表

### Requirement: PublicParam edit form

系统 SHALL 提供公共参数编辑表单，预填当前数据。调用 `PUT /api/v1/sys/public-param/{id}` 更新。

#### Scenario: Edit public param value

- **WHEN** 用户修改参数值并点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/public-param/{id}` 发送更新数据，成功后刷新列表

### Requirement: PublicParam batch delete

系统 SHALL 支持批量删除公共参数，通过 `DELETE /api/v1/sys/public-param` 发送 ID 数组。

#### Scenario: Batch delete selected params

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/public-param` 发送选中 ID 数组，成功后刷新列表

### Requirement: PublicParam i18n support

公共参数页面所有用户可见字符串 SHALL 通过 i18n `t()` 函数引用 `publicParam.*` 命名空间的翻译 key。
