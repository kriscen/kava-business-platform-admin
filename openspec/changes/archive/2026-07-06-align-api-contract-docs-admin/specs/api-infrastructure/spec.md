## MODIFIED Requirements

### Requirement: ApiResponse 与后端 JsonResult 对齐

`ApiResponse<T>` 类型 SHALL 与后端 `JsonResult<T>` 完全对齐，包含 `success`、`data`、`errorCode`、`errorMessage` 字段。前端 SHALL NOT 使用 `code/msg` 作为普通业务接口的统一响应结构。

#### Scenario: 业务成功响应

- **WHEN** 后端返回 `{ "success": true, "data": { "id": 1 }, "errorCode": null, "errorMessage": null }`
- **THEN** 前端 `ApiResponse<{ id: number }>` SHALL 将 `success` 识别为 `true`
- **AND** 请求 Promise SHALL resolve 原始 `JsonResult` 包装对象

#### Scenario: 业务失败响应

- **WHEN** 后端返回 `{ "success": false, "data": null, "errorCode": "10040003", "errorMessage": "租户状态流转不合法" }`
- **THEN** 响应拦截器 SHALL 展示 `errorMessage`
- **AND** 请求 Promise SHALL reject 该业务错误对象

### Requirement: 分页类型定义

`PagingInfo<T>` 类型 SHALL 与后端分页响应结构对齐，包含 `list`、`total`、`pageNo`、`pageSize` 字段。前端 SHALL NOT 将后端分页响应定义为 `records/size/current/pages`。

#### Scenario: 分页响应映射

- **WHEN** 后端返回 `JsonResult<PagingInfo<User>>` 且 `data.list` 包含当前页数据
- **THEN** `useCrudPage` SHALL 将 `data.list` 映射为 DataTable 内部 `records`
- **AND** DataTable SHALL 使用 `data.total` 渲染分页总数

### Requirement: 核心实体类型定义使用 group 命名

前端 UPMS 类型 SHALL 使用 `group` 命名描述组织分组字段，SHALL NOT 恢复旧的 `dept` 类型和 API 模块要求。

#### Scenario: 用户分组字段

- **WHEN** 定义用户请求、列表响应和查询参数
- **THEN** 字段 SHALL 使用 `groupId`、`groupName`
- **AND** 不 SHALL 要求 `deptId`、`deptName` 或 `deptApi`
