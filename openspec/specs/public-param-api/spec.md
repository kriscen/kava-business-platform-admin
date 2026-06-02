## Requirements

### Requirement: PublicParam type definitions

系统 SHALL 定义 `SysPublicParamQuery`（查询参数）、`SysPublicParamRequest`（创建/更新请求）、`SysPublicParamListResponse`（列表响应）、`SysPublicParamDetailResponse`（详情响应）类型。

#### Scenario: Type definitions match API contract

- **WHEN** PublicParam API 模块使用这些类型发起请求
- **THEN** 请求体和响应体结构与 `docs/04-frontend/upms-api.md` 中的定义一致

### Requirement: PublicParam API module with CRUD operations

系统 SHALL 提供 `publicParamApi` 模块，包含 `getPage`、`getById`、`create`、`update(id, data)`、`remove(ids)` 方法，基础路径为 `/api/v1/sys/public-param`。

#### Scenario: Get paginated list

- **WHEN** 调用 `publicParamApi.getPage({ pageNo: 1, pageSize: 10 })`
- **THEN** 发送 `GET /api/v1/sys/public-param/page?pageNo=1&pageSize=10`

#### Scenario: Create public param

- **WHEN** 调用 `publicParamApi.create(data)`
- **THEN** 发送 `POST /api/v1/sys/public-param` with JSON body

#### Scenario: Update public param

- **WHEN** 调用 `publicParamApi.update(1, data)`
- **THEN** 发送 `PUT /api/v1/sys/public-param/1` with JSON body

#### Scenario: Batch delete

- **WHEN** 调用 `publicParamApi.remove([1, 2, 3])`
- **THEN** 发送 `DELETE /api/v1/sys/public-param` with body `[1, 2, 3]`
