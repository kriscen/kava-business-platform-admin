## MODIFIED Requirements

### Requirement: Mock endpoints aligned with real API paths

系统 SHALL 在 mock 数据中提供与真实后端完全一致的 API 路径和响应结构。新增 dept、tenant、publicParam 三个资源的 mock 端点。

#### Scenario: Dept mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/dept/page`
- **THEN** 返回符合 `PagingInfo<SysDeptListResponse>` 结构的分页数据

#### Scenario: Dept tree mock

- **WHEN** 开发模式下请求 `GET /api/v1/sys/dept/tree`
- **THEN** 返回嵌套 `children` 结构的部门树形数据

#### Scenario: Tenant mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/tenant/page`
- **THEN** 返回符合 `PagingInfo<SysTenantListResponse>` 结构的分页数据

#### Scenario: Tenant enable/disable mock

- **WHEN** 开发模式下请求 `PUT /api/v1/sys/tenant/1/enable` 或 `disable`
- **THEN** 返回成功响应

#### Scenario: PublicParam mock endpoints

- **WHEN** 开发模式下请求 `GET /api/v1/sys/public-param/page`
- **THEN** 返回符合 `PagingInfo<SysPublicParamListResponse>` 结构的分页数据
