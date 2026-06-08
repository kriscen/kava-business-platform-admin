# Log Management Spec

### Requirement: 日志管理页面

系统 SHALL 展示操作日志分页列表，支持查看日志详情。日志为只读数据，不支持新增、编辑、删除。

#### Scenario: 日志列表加载

- **WHEN** 用户访问 `/platform/system/log`
- **THEN** 系统调用 `GET /api/v1/sys/log/page?pageNo=1&pageSize=10` 展示分页表格，列包含：日志类型 (logType)、标题 (title)、请求URI (requestUri)、请求方法 (method)、服务ID (serviceId)、操作人 (createBy)、创建时间 (gmtCreate)、操作（查看详情）

#### Scenario: 日志按条件搜索

- **WHEN** 用户在搜索栏输入标题、日志类型或操作人
- **THEN** 系统调用 `GET /api/v1/sys/log/page?title={keyword}&logType={type}&createBy={user}` 展示过滤结果

#### Scenario: 查看日志详情

- **WHEN** 用户点击某行的"查看详情"按钮
- **THEN** 系统调用 `GET /api/v1/sys/log/{id}` 获取详情，在弹窗中展示完整日志信息（含 remoteAddr、params、time、exception 等字段）

#### Scenario: 日志页面无新增按钮

- **WHEN** 用户访问日志管理页面
- **THEN** 页面不显示"新增"按钮，不显示批量删除功能，行操作不显示"编辑"和"删除"按钮
