# CRUD Management Pages Spec

## Purpose

系统管理 CRUD 页面的统一模式：使用 DataTable + FormModal + 批量删除 + i18n 构建管理页面，覆盖部门、租户、公共参数三个实体。

## Requirements

### Requirement: 部门管理页面

系统 SHALL 展示部门分页列表，包含 CRUD 操作和树形上级选择。

#### Scenario: 部门列表加载

- **WHEN** 用户访问 `/platform/system/dept`
- **THEN** 系统调用 `GET /api/v1/sys/dept/page?pageNo=1&pageSize=10` 展示分页表格，列包含：部门名称 (name)、上级部门 (parentName)、排序 (sortOrder)、创建时间 (gmtCreate)、操作（编辑/删除）

#### Scenario: 部门名称搜索

- **WHEN** 用户在搜索栏输入部门名称并触发搜索
- **THEN** 系统调用 `GET /api/v1/sys/dept/page?name={keyword}` 展示过滤结果

#### Scenario: 创建部门（含上级选择）

- **WHEN** 用户点击"新增"按钮，填写部门名称，从 tree-select 选择上级部门，点击确认
- **THEN** 系统调用 `POST /api/v1/sys/dept` 发送 `{ name, pid, sortOrder }`，成功后刷新列表

#### Scenario: 创建顶级部门

- **WHEN** 用户创建部门时不选择上级部门
- **THEN** 系统发送 `pid` 为空，代表顶级部门

#### Scenario: 编辑部门

- **WHEN** 用户点击某行的编辑按钮，修改部门名称，点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/dept/{id}` 发送更新数据，成功后刷新列表

#### Scenario: 批量删除部门

- **WHEN** 用户勾选多个部门行，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/dept` 发送选中 ID 数组，成功后刷新列表

### Requirement: 租户管理页面

系统 SHALL 展示租户分页列表，支持状态展示、启停操作和创建时的管理员字段。

#### Scenario: 租户列表加载

- **WHEN** 用户访问 `/platform/system/tenant`
- **THEN** 系统调用 `GET /api/v1/sys/tenant/page?pageNo=1&pageSize=10` 展示分页表格，列包含：租户名称 (name)、租户编码 (code)、域名 (tenantDomain)、网站名称 (websiteName)、生效开始 (startTime)、生效结束 (endTime)、状态 (status, Badge)、创建时间 (gmtCreate)、操作（编辑/删除/启用/禁用）

#### Scenario: 租户名称和状态搜索

- **WHEN** 用户在搜索栏输入租户名称并选择状态筛选
- **THEN** 系统调用 `GET /api/v1/sys/tenant/page?name={keyword}&status={status}` 展示过滤结果

#### Scenario: 租户状态 Badge 展示

- **WHEN** 租户 status 为 "0"
- **THEN** 状态列显示绿色 Badge "正常"；status 为 "9" 时显示红色 Badge "冻结"

#### Scenario: 禁用正常租户

- **WHEN** 用户点击正常租户的"禁用"按钮并确认
- **THEN** 系统调用 `PUT /api/v1/sys/tenant/{id}/disable`，成功后刷新列表

#### Scenario: 启用冻结租户

- **WHEN** 用户点击冻结租户的"启用"按钮并确认
- **THEN** 系统调用 `PUT /api/v1/sys/tenant/{id}/enable`，成功后刷新列表

#### Scenario: 创建租户（含管理员字段）

- **WHEN** 用户填写所有字段包括管理员信息，点击确认
- **THEN** 系统调用 `POST /api/v1/sys/tenant` 发送完整数据（含 adminUsername、adminPassword），成功后刷新列表

#### Scenario: 编辑租户（隐藏管理员字段）

- **WHEN** 用户点击编辑按钮
- **THEN** 表单预填当前信息，不显示 adminUsername 和 adminPassword 字段；调用 `PUT /api/v1/sys/tenant/{id}` 更新

#### Scenario: 批量删除租户

- **WHEN** 用户勾选多个租户行，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/tenant` 发送选中 ID 数组，成功后刷新列表

### Requirement: 公共参数管理页面

系统 SHALL 展示公共参数分页列表，支持完整 CRUD。

#### Scenario: 公共参数列表加载

- **WHEN** 用户访问 `/platform/system/public-param`
- **THEN** 系统调用 `GET /api/v1/sys/public-param/page?pageNo=1&pageSize=10` 展示分页表格，列包含：参数名称 (publicName)、参数键 (publicKey)、参数值 (publicValue)、状态 (status)、参数类型 (publicType)、系统标识 (systemFlag)、操作（编辑/删除）

#### Scenario: 公共参数名称和键搜索

- **WHEN** 用户在搜索栏输入参数名称和参数键
- **THEN** 系统调用 `GET /api/v1/sys/public-param/page?publicName={name}&publicKey={key}` 展示过滤结果

#### Scenario: 创建公共参数

- **WHEN** 用户填写参数信息（publicName、publicKey、publicValue、status、publicType、systemFlag）并点击确认
- **THEN** 系统调用 `POST /api/v1/sys/public-param` 发送数据，成功后刷新列表

#### Scenario: 编辑公共参数

- **WHEN** 用户修改参数值并点击确认
- **THEN** 系统调用 `PUT /api/v1/sys/public-param/{id}` 发送更新数据，成功后刷新列表

#### Scenario: 批量删除公共参数

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/public-param` 发送选中 ID 数组，成功后刷新列表

### Requirement: CRUD 管理页 i18n 支持

所有管理页面的用户可见字符串 SHALL 通过 i18n `t()` 函数引用对应模块的翻译 key。

#### Scenario: 部门页面 i18n

- **WHEN** 部门页面渲染时
- **THEN** 表头、按钮文字、搜索标签、提示消息均通过 `t('dept.xxx')` 引用

#### Scenario: 租户页面 i18n

- **WHEN** 租户页面渲染时
- **THEN** 所有用户可见字符串通过 `t('tenant.xxx')` 引用

#### Scenario: 公共参数页面 i18n

- **WHEN** 公共参数页面渲染时
- **THEN** 所有用户可见字符串通过 `t('publicParam.xxx')` 引用
