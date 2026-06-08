# App Management Spec

### Requirement: 应用管理页面

系统 SHALL 展示应用分页列表，支持 CRUD 操作和菜单绑定。仅平台管理员可见。

#### Scenario: 应用列表加载

- **WHEN** 用户访问 `/platform/system/app`
- **THEN** 系统调用 `GET /api/v1/sys/app/page?pageNo=1&pageSize=10` 展示分页表格，列包含：应用编码 (code)、应用名称 (name)、应用图标 (icon)、状态 (status)、创建时间 (gmtCreate)、操作（编辑/删除/绑定菜单）

#### Scenario: 应用按名称搜索

- **WHEN** 用户在搜索栏输入应用名称
- **THEN** 系统调用 `GET /api/v1/sys/app/page?appName={keyword}` 展示过滤结果

#### Scenario: 创建应用

- **WHEN** 用户点击"新增"按钮，填写应用信息（code、name、icon、description），点击确认
- **THEN** 系统调用 `POST /api/v1/sys/app` 发送数据，成功后刷新列表

#### Scenario: 编辑应用

- **WHEN** 用户点击某行的编辑按钮，修改应用信息，点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/app/{id}` 发送更新数据，成功后刷新列表

#### Scenario: 批量删除应用

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/app` 发送选中 ID 数组，成功后刷新列表

#### Scenario: 绑定应用菜单

- **WHEN** 用户点击某行的"绑定菜单"按钮
- **THEN** 系统弹出菜单选择弹窗，展示菜单树 Checkbox 列表，用户勾选菜单后点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/app/{id}/menus` 发送选中的菜单 ID 数组，成功后关闭弹窗

#### Scenario: 应用下拉列表

- **WHEN** 其他页面需要选择应用
- **THEN** 系统调用 `GET /api/v1/sys/app/dropdown` 获取应用列表（id、code、name），用于下拉选择组件
