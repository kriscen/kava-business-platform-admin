## ADDED Requirements

### Requirement: 文件分组管理页面

系统 SHALL 展示文件分组分页列表，支持 CRUD 操作。

#### Scenario: 文件分组列表加载

- **WHEN** 用户访问 `/platform/system/file-group`
- **THEN** 系统调用 `GET /api/v1/sys/file-group/page?pageNo=1&pageSize=10` 展示分页表格，列包含：分组名称 (name)、类型 (type)、创建时间 (gmtCreate)、操作（编辑/删除）

#### Scenario: 文件分组按名称搜索

- **WHEN** 用户在搜索栏输入分组名称
- **THEN** 系统调用 `GET /api/v1/sys/file-group/page?name={keyword}` 展示过滤结果

#### Scenario: 创建文件分组

- **WHEN** 用户点击"新增"按钮，填写分组信息（name、pid、type），点击确认
- **THEN** 系统调用 `POST /api/v1/sys/file-group` 发送数据，成功后刷新列表

#### Scenario: 编辑文件分组

- **WHEN** 用户点击某行的编辑按钮，修改分组信息，点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/file-group/{id}` 发送更新数据，成功后刷新列表

#### Scenario: 批量删除文件分组

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/file-group` 发送选中 ID 数组，成功后刷新列表
