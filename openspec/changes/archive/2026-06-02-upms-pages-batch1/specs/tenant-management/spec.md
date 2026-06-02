## ADDED Requirements

### Requirement: Tenant management page renders paginated tenant list

系统 SHALL 展示租户分页列表，包含列：租户名称 (name)、租户编码 (code)、域名 (tenantDomain)、网站名称 (websiteName)、生效开始 (startTime)、生效结束 (endTime)、状态 (status, Badge 展示)、创建时间 (gmtCreate)、操作（编辑/删除/启用/禁用）。

#### Scenario: Initial page load

- **WHEN** 用户访问 `/platform/system/tenant`
- **THEN** 系统调用 `GET /api/v1/sys/tenant/page?pageNo=1&pageSize=10` 并展示分页表格

#### Scenario: Search by name and status

- **WHEN** 用户在搜索栏输入租户名称并选择状态筛选
- **THEN** 系统调用 `GET /api/v1/sys/tenant/page?name={keyword}&status={status}` 并展示过滤结果

### Requirement: Tenant status displayed as Badge

系统 SHALL 将 status 字段渲染为 Badge 组件："0" 显示为"正常"（default variant），"9" 显示为"冻结"（destructive variant）。

#### Scenario: Normal status badge

- **WHEN** 租户 status 为 "0"
- **THEN** 状态列显示绿色 Badge 文字"正常"

#### Scenario: Frozen status badge

- **WHEN** 租户 status 为 "9"
- **THEN** 状态列显示红色 Badge 文字"冻结"

### Requirement: Tenant enable/disable toggle

系统 SHALL 在操作列提供启用/禁用按钮，根据当前 status 切换显示。点击后调用对应 PUT 接口。

#### Scenario: Disable a normal tenant

- **WHEN** 用户点击正常租户的"禁用"按钮并确认
- **THEN** 系统调用 `PUT /api/v1/sys/tenant/{id}/disable`，成功后刷新列表

#### Scenario: Enable a frozen tenant

- **WHEN** 用户点击冻结租户的"启用"按钮并确认
- **THEN** 系统调用 `PUT /api/v1/sys/tenant/{id}/enable`，成功后刷新列表

### Requirement: Tenant create form with conditional admin fields

系统 SHALL 提供租户创建表单，包含字段：租户名称 (name, 必填)、租户编码 (code, 必填)、域名 (tenantDomain)、网站名称 (websiteName)、logo (URL 输入)、页脚 (footer, textarea)、生效开始 (startTime, datetime-local)、生效结束 (endTime, datetime-local)、状态 (status, select)。创建模式下额外显示管理员用户名 (adminUsername) 和管理员密码 (adminPassword)。

#### Scenario: Create tenant with admin user

- **WHEN** 用户填写所有字段包括管理员信息，点击确认
- **THEN** 系统调用 `POST /api/v1/sys/tenant` 发送完整数据，成功后刷新列表

#### Scenario: Edit tenant hides admin fields

- **WHEN** 用户点击编辑按钮
- **THEN** 表单不显示 adminUsername 和 adminPassword 字段

### Requirement: Tenant edit form

系统 SHALL 提供租户编辑表单，预填当前租户信息。调用 `PUT /api/v1/sys/tenant/{id}` 更新。

#### Scenario: Edit tenant info

- **WHEN** 用户修改租户名称并点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/tenant/{id}` 发送更新数据，成功后刷新列表

### Requirement: Tenant batch delete

系统 SHALL 支持批量删除租户，通过 `DELETE /api/v1/sys/tenant` 发送 ID 数组。

#### Scenario: Batch delete selected tenants

- **WHEN** 用户勾选多个租户行，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/tenant` 发送选中 ID 数组，成功后刷新列表

### Requirement: Tenant i18n support

租户页面所有用户可见字符串 SHALL 通过 i18n `t()` 函数引用 `tenant.*` 命名空间的翻译 key。
