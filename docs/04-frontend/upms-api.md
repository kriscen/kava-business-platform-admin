# UPMS 前端对接文档

> 本文档面向前端开发者，包含 HTTP REST 接口、请求/响应字段定义和查询参数。

## 接入信息

| 项目     | 值                                                                 |
| -------- | ------------------------------------------------------------------ |
| 网关地址 | `http://{gateway-host}:8500/upms`                                  |
| 服务直连 | `http://{upms-host}:8610`                                          |
| API 前缀 | `/api/v1/sys/<resource>/`                                          |
| 认证方式 | Bearer Token（JWT），请求头 `Authorization: Bearer <access_token>` |

> 前端通过网关调用时，完整 URL 示例：`http://localhost:8500/upms/api/v1/sys/user/page?pageNo=1&pageSize=10`

通用响应包装：`JsonResult<T>`

```json
{
  "code": "0",
  "msg": "success",
  "data": { ... }
}
```

分页响应结构：`JsonResult<PagingInfo<T>>`

```json
{
  "code": "0",
  "msg": "success",
  "data": {
    "records": [ ... ],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
}
```

---

## HTTP REST 接口

### 用户管理 `/api/v1/sys/user/`

| 方法   | 路径    | 入参                              | 返回值                                        | 说明                                                         |
| ------ | ------- | --------------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| GET    | `/page` | `SysUserAdapterListQuery` (query) | `JsonResult<PagingInfo<SysUserListResponse>>` | 分页查询用户（响应含 groupName、tenantName、roleIds）        |
| GET    | `/{id}` | `id` (path)                       | `JsonResult<SysUserDetailResponse>`           | 用户详情（响应含 groupName、tenantName、roleNames、roleIds） |
| POST   | —       | `SysUserRequest` (body)           | `JsonResult<Long>`                            | 创建用户，返回新 ID                                          |
| PUT    | —       | `SysUserRequest` (body，含 id)    | `JsonResult<Boolean>`                         | 更新用户                                                     |
| DELETE | —       | `List<Long>` (body)               | `JsonResult<Boolean>`                         | 批量删除用户                                                 |

### 角色管理 `/api/v1/sys/role/`

| 方法   | 路径        | 入参                              | 返回值                                        | 说明                                                           |
| ------ | ----------- | --------------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| GET    | `/page`     | `SysRoleAdapterListQuery` (query) | `JsonResult<PagingInfo<SysRoleListResponse>>` | 分页查询角色（租户用户自动按 tenantId 过滤，平台管理员查全部） |
| GET    | `/{id}`     | `id` (path)                       | `JsonResult<SysRoleDetailResponse>`           | 角色详情（响应含 menuNames）                                   |
| POST   | —           | `SysRoleRequest` (body)           | `JsonResult<Long>`                            | 创建角色                                                       |
| PUT    | —           | `SysRoleRequest` (body，含 id)    | `JsonResult<Boolean>`                         | 更新角色                                                       |
| DELETE | —           | `List<Long>` (body)               | `JsonResult<Boolean>`                         | 批量删除角色                                                   |
| GET    | `/dropdown` | —                                 | `JsonResult<List<SysRoleDropdownResponse>>`   | 角色下拉列表（id、roleName、roleCode），按 roleName 排序       |

### 菜单管理 `/api/v1/sys/menu/`

| 方法   | 路径    | 入参                                  | 返回值                                        | 说明                                                  |
| ------ | ------- | ------------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| GET    | `/page` | `SysMenuAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysMenuListResponse>>` | 分页查询菜单                                          |
| GET    | `/{id}` | `id` (path)                           | `JsonResult<SysMenuDetailResponse>`           | 菜单详情                                              |
| POST   | —       | `SysMenuRequest` (body)               | `JsonResult<Long>`                            | 创建菜单                                              |
| PUT    | `/{id}` | `id` (path) + `SysMenuRequest` (body) | `JsonResult<Void>`                            | 更新菜单                                              |
| DELETE | —       | `List<Long>` (body)                   | `JsonResult<Void>`                            | 批量删除菜单                                          |
| GET    | `/tree` | — (从 UserContext 解析)               | `JsonResult<List<SysMenuListResponse>>`       | 当前用户菜单树（按 scope 和角色过滤，sortOrder 排序） |

### 分组管理 `/api/v1/sys/group/`

| 方法   | 路径    | 入参                                   | 返回值                                         | 说明                        |
| ------ | ------- | -------------------------------------- | ---------------------------------------------- | --------------------------- |
| GET    | `/page` | `SysGroupAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysGroupListResponse>>` | 分页查询分组                |
| GET    | `/{id}` | `id` (path)                            | `JsonResult<SysGroupDetailResponse>`           | 分组详情                    |
| POST   | —       | `SysGroupRequest` (body)               | `JsonResult<Long>`                             | 创建分组                    |
| PUT    | `/{id}` | `id` (path) + `SysGroupRequest` (body) | `JsonResult<Void>`                             | 更新分组                    |
| DELETE | —       | `List<Long>` (body)                    | `JsonResult<Void>`                             | 批量删除分组                |
| GET    | `/tree` | —                                      | `JsonResult<List<SysGroupListResponse>>`       | 分组树形结构（按 pid 组装） |

### 租户管理 `/api/v1/sys/tenant/`

| 方法   | 路径            | 入参                                    | 返回值                                          | 说明                                                              |
| ------ | --------------- | --------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| GET    | `/page`         | `SysTenantAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysTenantListResponse>>` | 分页查询租户                                                      |
| GET    | `/{id}`         | `id` (path)                             | `JsonResult<SysTenantDetailResponse>`           | 租户详情                                                          |
| POST   | —               | `SysTenantRequest` (body)               | `JsonResult<Long>`                              | 创建租户（可传入 adminUsername/adminPassword 自动创建管理员用户） |
| PUT    | `/{id}`         | `id` (path) + `SysTenantRequest` (body) | `JsonResult<Void>`                              | 更新租户                                                          |
| DELETE | —               | `List<Long>` (body)                     | `JsonResult<Void>`                              | 批量删除租户                                                      |
| PUT    | `/{id}/enable`  | `id` (path)                             | `JsonResult<Void>`                              | 启用租户（重复启用抛 A00403）                                     |
| PUT    | `/{id}/disable` | `id` (path)                             | `JsonResult<Void>`                              | 停用租户（重复停用抛 A00403）                                     |
| GET    | `/dropdown`     | —                                       | `JsonResult<List<SysTenantDropdownResponse>>`   | 租户下拉列表（id、name、code、status），不分页                    |

### 地区管理 `/api/v1/sys/area/`

| 方法   | 路径        | 入参                                                  | 返回值                                        | 说明                                   |
| ------ | ----------- | ----------------------------------------------------- | --------------------------------------------- | -------------------------------------- |
| GET    | `/page`     | `SysAreaAdapterListQuery` (query)                     | `JsonResult<PagingInfo<SysAreaListResponse>>` | 分页查询地区                           |
| GET    | `/tree`     | `SysAreaAdapterListQuery` (query, 支持 areaType 参数) | `JsonResult<List<Tree<Long>>>`                | 树形地区数据（可按 areaType 筛选层级） |
| GET    | `/children` | `pid` (query, 默认 100000)                            | `JsonResult<List<SysAreaListResponse>>`       | 按父节点查询直接子节点（懒加载场景）   |
| GET    | `/{id}`     | `id` (path)                                           | `JsonResult<SysAreaDetailResponse>`           | 地区详情                               |
| POST   | —           | `SysAreaRequest` (body)                               | `JsonResult<Long>`                            | 创建地区                               |
| PUT    | `/{id}`     | `id` (path) + `SysAreaRequest` (body)                 | `JsonResult<Void>`                            | 更新地区                               |
| DELETE | —           | `List<Long>` (body)                                   | `JsonResult<Void>`                            | 批量删除地区                           |

### 日志管理 `/api/v1/sys/log/`

| 方法 | 路径    | 入参                             | 返回值                                       | 说明         |
| ---- | ------- | -------------------------------- | -------------------------------------------- | ------------ |
| GET  | `/page` | `SysLogAdapterListQuery` (query) | `JsonResult<PagingInfo<SysLogListResponse>>` | 分页查询日志 |
| GET  | `/{id}` | `id` (path)                      | `JsonResult<SysLogDetailResponse>`           | 日志详情     |

### 审计日志 `/api/v1/sys/audit-log/`

| 方法 | 路径    | 入参                                  | 返回值                                            | 说明             |
| ---- | ------- | ------------------------------------- | ------------------------------------------------- | ---------------- |
| GET  | `/page` | `SysAuditLogAdapterListQuery` (query) | `JsonResult<PagingInfo<SysAuditLogListResponse>>` | 分页查询审计日志 |
| GET  | `/{id}` | `id` (path)                           | `JsonResult<SysAuditLogDetailResponse>`           | 审计日志详情     |

### 文件管理 `/api/v1/sys/file/`

| 方法   | 路径    | 入参                                  | 返回值                                        | 说明         |
| ------ | ------- | ------------------------------------- | --------------------------------------------- | ------------ |
| GET    | `/page` | `SysFileAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysFileListResponse>>` | 分页查询文件 |
| GET    | `/{id}` | `id` (path)                           | `JsonResult<SysFileDetailResponse>`           | 文件详情     |
| POST   | —       | `SysFileRequest` (body)               | `JsonResult<Long>`                            | 创建文件记录 |
| PUT    | `/{id}` | `id` (path) + `SysFileRequest` (body) | `JsonResult<Void>`                            | 更新文件记录 |
| DELETE | —       | `List<Long>` (body)                   | `JsonResult<Void>`                            | 批量删除文件 |

### 文件分组 `/api/v1/sys/file-group/`

| 方法   | 路径    | 入参                                       | 返回值                                             | 说明             |
| ------ | ------- | ------------------------------------------ | -------------------------------------------------- | ---------------- |
| GET    | `/page` | `SysFileGroupAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysFileGroupListResponse>>` | 分页查询文件分组 |
| GET    | `/{id}` | `id` (path)                                | `JsonResult<SysFileGroupDetailResponse>`           | 分组详情         |
| POST   | —       | `SysFileGroupRequest` (body)               | `JsonResult<Long>`                                 | 创建分组         |
| PUT    | `/{id}` | `id` (path) + `SysFileGroupRequest` (body) | `JsonResult<Void>`                                 | 更新分组         |
| DELETE | —       | `List<Long>` (body)                        | `JsonResult<Void>`                                 | 批量删除分组     |

### 国际化 `/api/v1/sys/i18n/`

数据模型为 KV 模式（code + language + content），同一 code 可对应多语言翻译记录。

| 方法   | 路径    | 入参                                                       | 返回值                                        | 说明                                 |
| ------ | ------- | ---------------------------------------------------------- | --------------------------------------------- | ------------------------------------ |
| GET    | `/page` | `SysI18nAdapterListQuery` (query, 支持 code/language 过滤) | `JsonResult<PagingInfo<SysI18nListResponse>>` | 分页查询（code 模糊、language 精确） |
| GET    | `/{id}` | `id` (path)                                                | `JsonResult<SysI18nDetailResponse>`           | 详情                                 |
| POST   | —       | `SysI18nRequest` (body, 字段: code/language/content)       | `JsonResult<Long>`                            | 创建（code+language 唯一）           |
| PUT    | `/{id}` | `id` (path) + `SysI18nRequest` (body)                      | `JsonResult<Void>`                            | 更新                                 |
| DELETE | —       | `List<Long>` (body)                                        | `JsonResult<Void>`                            | 批量删除                             |

### 公共参数 `/api/v1/sys/public-param/`

| 方法   | 路径    | 入参                                         | 返回值                                               | 说明     |
| ------ | ------- | -------------------------------------------- | ---------------------------------------------------- | -------- |
| GET    | `/page` | `SysPublicParamAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysPublicParamListResponse>>` | 分页查询 |
| GET    | `/{id}` | `id` (path)                                  | `JsonResult<SysPublicParamDetailResponse>`           | 详情     |
| POST   | —       | `SysPublicParamRequest` (body)               | `JsonResult<Long>`                                   | 创建     |
| PUT    | `/{id}` | `id` (path) + `SysPublicParamRequest` (body) | `JsonResult<Void>`                                   | 更新     |
| DELETE | —       | `List<Long>` (body)                          | `JsonResult<Void>`                                   | 批量删除 |

### 路由配置 `/api/v1/sys/route-conf/`

| 方法   | 路径    | 入参                                       | 返回值                                             | 说明     |
| ------ | ------- | ------------------------------------------ | -------------------------------------------------- | -------- |
| GET    | `/page` | `SysRouteConfAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysRouteConfListResponse>>` | 分页查询 |
| GET    | `/{id}` | `id` (path)                                | `JsonResult<SysRouteConfDetailResponse>`           | 详情     |
| POST   | —       | `SysRouteConfRequest` (body)               | `JsonResult<Long>`                                 | 创建     |
| PUT    | `/{id}` | `id` (path) + `SysRouteConfRequest` (body) | `JsonResult<Void>`                                 | 更新     |
| DELETE | —       | `List<Long>` (body)                        | `JsonResult<Void>`                                 | 批量删除 |

### OAuth 客户端 `/api/v1/sys/oauth-client/`

| 方法   | 路径    | 入参                                         | 返回值                                               | 说明     |
| ------ | ------- | -------------------------------------------- | ---------------------------------------------------- | -------- |
| GET    | `/page` | `SysOauthClientAdapterListQuery` (query)     | `JsonResult<PagingInfo<SysOauthClientListResponse>>` | 分页查询 |
| GET    | `/{id}` | `id` (path)                                  | `JsonResult<SysOauthClientDetailResponse>`           | 详情     |
| POST   | —       | `SysOauthClientRequest` (body)               | `JsonResult<Long>`                                   | 创建     |
| PUT    | `/{id}` | `id` (path) + `SysOauthClientRequest` (body) | `JsonResult<Void>`                                   | 更新     |
| DELETE | —       | `List<Long>` (body)                          | `JsonResult<Void>`                                   | 批量删除 |

### 应用管理 `/api/v1/sys/app/`

| 方法   | 路径          | 入参                                    | 返回值                                       | 说明                           |
| ------ | ------------- | --------------------------------------- | -------------------------------------------- | ------------------------------ |
| GET    | `/page`       | `appName`、`pageNo`、`pageSize` (query) | `JsonResult<PagingInfo<SysAppListResponse>>` | 分页查询应用                   |
| GET    | `/{id}`       | `id` (path)                             | `JsonResult<SysAppDetailResponse>`           | 应用详情                       |
| POST   | —             | `SysAppRequest` (body)                  | `JsonResult<Long>`                           | 创建应用，返回新 ID            |
| PUT    | `/{id}`       | `id` (path) + `SysAppRequest` (body)    | `JsonResult<Void>`                           | 更新应用                       |
| DELETE | —             | `List<Long>` (body)                     | `JsonResult<Void>`                           | 批量删除应用                   |
| GET    | `/dropdown`   | —                                       | `JsonResult<List<SysAppDropdownResponse>>`   | 应用下拉列表（id、code、name） |
| PUT    | `/{id}/menus` | `id` (path) + `List<Long>` (body)       | `JsonResult<Void>`                           | 绑定应用菜单                   |

### 租户应用订阅 `/api/v1/sys/tenant/{tenantId}/apps`

| 方法   | 路径       | 入参                                                       | 返回值                                       | 说明                     |
| ------ | ---------- | ---------------------------------------------------------- | -------------------------------------------- | ------------------------ |
| POST   | —          | `tenantId` (path) + `SysTenantAppRequest` (body, 仅 appId) | `JsonResult<Void>`                           | 租户订阅应用             |
| DELETE | `/{appId}` | `tenantId` (path) + `appId` (path)                         | `JsonResult<Void>`                           | 租户退订应用             |
| GET    | —          | `tenantId` (path)                                          | `JsonResult<List<SysTenantAppListResponse>>` | 查询租户已订阅的应用列表 |

---

## 请求体字段（RequestBody）

### SysUserRequest

| 字段       | 类型         | 必填     | 说明             |
| ---------- | ------------ | -------- | ---------------- |
| `id`       | `Long`       | PUT 必填 | 用户 ID          |
| `username` | `String`     | 是       | 用户名           |
| `password` | `String`     | 创建必填 | 密码             |
| `phone`    | `String`     | 否       | 手机号           |
| `avatar`   | `String`     | 否       | 头像             |
| `groupId`  | `Long`       | 否       | 分组 ID          |
| `tenantId` | `Long`       | 否       | 租户 ID          |
| `nickname` | `String`     | 否       | 昵称             |
| `name`     | `String`     | 否       | 真实姓名         |
| `email`    | `String`     | 否       | 邮箱             |
| `lockFlag` | `String`     | 否       | 锁定标记         |
| `roleIds`  | `List<Long>` | 否       | 关联角色 ID 列表 |

### SysRoleRequest

| 字段       | 类型         | 必填     | 说明             |
| ---------- | ------------ | -------- | ---------------- |
| `id`       | `Long`       | PUT 必填 | 角色 ID          |
| `roleName` | `String`     | 是       | 角色名称         |
| `roleCode` | `String`     | 是       | 角色编码         |
| `roleDesc` | `String`     | 否       | 角色描述         |
| `dsType`   | `String`     | 否       | 数据权限类型     |
| `dsScope`  | `String`     | 否       | 数据权限范围     |
| `menuIds`  | `List<Long>` | 否       | 关联菜单 ID 列表 |

### SysMenuRequest

| 字段         | 类型      | 必填     | 说明                       |
| ------------ | --------- | -------- | -------------------------- |
| `id`         | `Long`    | PUT 必填 | 菜单 ID                    |
| `name`       | `String`  | 是       | 菜单名称                   |
| `permission` | `String`  | 否       | 权限标识                   |
| `pid`        | `Long`    | 否       | 父菜单 ID                  |
| `path`       | `String`  | 否       | 前端路由路径               |
| `component`  | `String`  | 否       | 前端组件路径               |
| `icon`       | `String`  | 否       | 图标                       |
| `sortOrder`  | `Integer` | 否       | 排序                       |
| `menuType`   | `String`  | 是       | 菜单类型（0-菜单, 1-按钮） |
| `visible`    | `String`  | 否       | 是否可见                   |
| `keepAlive`  | `String`  | 否       | 路由缓存                   |
| `embedded`   | `String`  | 否       | 是否内嵌                   |

### SysGroupRequest

| 字段        | 类型      | 必填     | 说明      |
| ----------- | --------- | -------- | --------- |
| `id`        | `Long`    | PUT 必填 | 分组 ID   |
| `name`      | `String`  | 是       | 分组名称  |
| `pid`       | `Long`    | 否       | 父分组 ID |
| `sortOrder` | `Integer` | 否       | 排序      |

### SysTenantRequest

| 字段            | 类型            | 必填       | 说明                         |
| --------------- | --------------- | ---------- | ---------------------------- |
| `id`            | `Long`          | PUT 必填   | 租户 ID                      |
| `name`          | `String`        | 是         | 租户名称                     |
| `code`          | `String`        | 是         | 租户编码                     |
| `tenantDomain`  | `String`        | 否         | 租户域名                     |
| `websiteName`   | `String`        | 否         | 网站名称                     |
| `logo`          | `String`        | 否         | Logo                         |
| `footer`        | `String`        | 否         | 页脚                         |
| `startTime`     | `LocalDateTime` | 否         | 生效开始时间                 |
| `endTime`       | `LocalDateTime` | 否         | 生效结束时间                 |
| `status`        | `String`        | 否         | 状态（0-正常, 9-冻结）       |
| `adminUsername` | `String`        | 创建时可选 | 管理员用户名（仅创建时使用） |
| `adminPassword` | `String`        | 创建时可选 | 管理员密码（仅创建时使用）   |

### SysAreaRequest

| 字段         | 类型     | 必填     | 说明                             |
| ------------ | -------- | -------- | -------------------------------- |
| `id`         | `Long`   | PUT 必填 | 地区 ID                          |
| `pid`        | `Long`   | 否       | 父节点 ID                        |
| `name`       | `String` | 是       | 地区名称                         |
| `adcode`     | `Long`   | 否       | 高德区域编码                     |
| `areaType`   | `String` | 否       | 类型（0-国家, 1-省, 2-市, 3-区） |
| `areaStatus` | `String` | 否       | 状态（0-停用, 1-启用）           |
| `cityCode`   | `String` | 否       | 城市编码                         |

### SysOauthClientRequest

| 字段                   | 类型       | 必填     | 说明                                        |
| ---------------------- | ---------- | -------- | ------------------------------------------- |
| `id`                   | `Long`     | PUT 必填 | 主键                                        |
| `clientId`             | `String`   | 是       | 客户端 ID                                   |
| `clientSecret`         | `String`   | 是       | 客户端密钥                                  |
| `scope`                | `String`   | 是       | 授权范围                                    |
| `authorizedGrantTypes` | `String[]` | 是       | 授权类型                                    |
| `webServerRedirectUri` | `String`   | 否       | 回调地址                                    |
| `accessTokenValidity`  | `Integer`  | 否       | Access Token 有效期（秒）                   |
| `refreshTokenValidity` | `Integer`  | 否       | Refresh Token 有效期（秒）                  |
| `autoapprove`          | `String`   | 否       | 自动授权                                    |
| `tenantId`             | `Long`     | 否       | 所属租户（传递 `additionalInformation` 中） |
| `userType`             | `String`   | 否       | 用户类型（传递 `additionalInformation` 中） |

### SysAppRequest

| 字段          | 类型         | 必填     | 说明             |
| ------------- | ------------ | -------- | ---------------- |
| `id`          | `Long`       | PUT 必填 | 应用 ID          |
| `code`        | `String`     | 是       | 应用编码         |
| `name`        | `String`     | 是       | 应用名称         |
| `icon`        | `String`     | 否       | 应用图标         |
| `description` | `String`     | 否       | 应用描述         |
| `menuIds`     | `List<Long>` | 否       | 关联菜单 ID 列表 |

### SysTenantAppRequest

| 字段       | 类型   | 必填 | 说明    |
| ---------- | ------ | ---- | ------- |
| `tenantId` | `Long` | 是   | 租户 ID |
| `appId`    | `Long` | 是   | 应用 ID |

### 其他 Request（通用字段模式）

以下资源的 Request 字段结构相对简单，前端按需传递即可：

| 资源                    | 主要字段                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `SysLogRequest`         | `logType`, `title`, `remoteAddr`, `requestUri`, `method`, `params`, `time`, `exception`, `serviceId` |
| `SysAuditLogRequest`    | `auditName`, `auditField`, `beforeVal`, `afterVal`, `tenantId`                                       |
| `SysFileRequest`        | `fileName`, `original`, `bucketName`, `dir`, `type`, `groupId`, `fileSize`                           |
| `SysFileGroupRequest`   | `pid`, `type`, `name`                                                                                |
| `SysI18nRequest`        | `code`, `language`, `content`                                                                        |
| `SysPublicParamRequest` | `publicName`, `publicKey`, `publicValue`, `status`, `publicType`, `systemFlag`                       |
| `SysRouteConfRequest`   | `routeId`, `routeName`, `predicates`, `filters`, `uri`, `sortOrder`, `metadata`                      |

---

## 响应体字段（ResponseBody）

### 用户

**SysUserListResponse**（列表）

| 字段          | 类型            | 说明                 |
| ------------- | --------------- | -------------------- |
| `id`          | `Long`          | 用户 ID              |
| `username`    | `String`        | 用户名               |
| `phone`       | `String`        | 手机号               |
| `avatar`      | `String`        | 头像                 |
| `nickname`    | `String`        | 昵称                 |
| `name`        | `String`        | 真实姓名             |
| `email`       | `String`        | 邮箱                 |
| `groupId`     | `Long`          | 分组 ID              |
| `groupName`   | `String`        | 分组名称（富化字段） |
| `tenantId`    | `Long`          | 租户 ID              |
| `tenantName`  | `String`        | 租户名称（富化字段） |
| `lockFlag`    | `String`        | 锁定标记             |
| `roleIds`     | `List<Long>`    | 关联角色 ID 列表     |
| `gmtCreate`   | `LocalDateTime` | 创建时间             |
| `gmtModified` | `LocalDateTime` | 更新时间             |

**SysUserDetailResponse**（详情）

在 ListResponse 基础上额外返回：

| 字段        | 类型           | 说明         |
| ----------- | -------------- | ------------ |
| `roleNames` | `List<String>` | 角色名称列表 |

### 角色

**SysRoleListResponse**（列表）

| 字段          | 类型            | 说明         |
| ------------- | --------------- | ------------ |
| `id`          | `Long`          | 角色 ID      |
| `roleName`    | `String`        | 角色名称     |
| `roleCode`    | `String`        | 角色编码     |
| `roleDesc`    | `String`        | 角色描述     |
| `dsType`      | `String`        | 数据权限类型 |
| `gmtCreate`   | `LocalDateTime` | 创建时间     |
| `gmtModified` | `LocalDateTime` | 更新时间     |

**SysRoleDetailResponse**（详情）

在 ListResponse 基础上额外返回：

| 字段        | 类型           | 说明             |
| ----------- | -------------- | ---------------- |
| `menuIds`   | `List<Long>`   | 关联菜单 ID 列表 |
| `menuNames` | `List<String>` | 关联菜单名称列表 |

**SysRoleDropdownResponse**（下拉）

| 字段       | 类型     | 说明     |
| ---------- | -------- | -------- |
| `id`       | `Long`   | 角色 ID  |
| `roleName` | `String` | 角色名称 |
| `roleCode` | `String` | 角色编码 |

### 菜单

**SysMenuListResponse**（列表/树）

| 字段         | 类型                        | 说明                       |
| ------------ | --------------------------- | -------------------------- |
| `id`         | `Long`                      | 菜单 ID                    |
| `name`       | `String`                    | 菜单名称                   |
| `permission` | `String`                    | 权限标识                   |
| `pid`        | `Long`                      | 父菜单 ID                  |
| `path`       | `String`                    | 前端路由路径               |
| `component`  | `String`                    | 前端组件路径               |
| `icon`       | `String`                    | 图标                       |
| `sortOrder`  | `Integer`                   | 排序                       |
| `menuType`   | `String`                    | 菜单类型（0-菜单, 1-按钮） |
| `visible`    | `String`                    | 是否可见                   |
| `keepAlive`  | `String`                    | 路由缓存                   |
| `embedded`   | `String`                    | 是否内嵌                   |
| `parentName` | `String`                    | 父菜单名称                 |
| `children`   | `List<SysMenuListResponse>` | 子菜单（树形结构）         |

**SysMenuDetailResponse**（详情）

与 ListResponse 类似，但不包含 `children`，包含 `parentName`。

### 分组

**SysGroupListResponse**（列表/树）

| 字段         | 类型                         | 说明               |
| ------------ | ---------------------------- | ------------------ |
| `id`         | `Long`                       | 分组 ID            |
| `name`       | `String`                     | 分组名称           |
| `sortOrder`  | `Integer`                    | 排序               |
| `pid`        | `Long`                       | 父分组 ID          |
| `parentName` | `String`                     | 父分组名称         |
| `children`   | `List<SysGroupListResponse>` | 子分组（树形结构） |
| `gmtCreate`  | `LocalDateTime`              | 创建时间           |

**SysGroupDetailResponse**（详情）

与 ListResponse 类似，但不包含 `children`，包含 `parentName`。

### 租户

**SysTenantListResponse / DetailResponse**（字段一致）

| 字段           | 类型            | 说明                   |
| -------------- | --------------- | ---------------------- |
| `id`           | `Long`          | 租户 ID                |
| `name`         | `String`        | 租户名称               |
| `code`         | `String`        | 租户编码               |
| `tenantDomain` | `String`        | 租户域名               |
| `websiteName`  | `String`        | 网站名称               |
| `logo`         | `String`        | Logo                   |
| `footer`       | `String`        | 页脚                   |
| `startTime`    | `LocalDateTime` | 生效开始时间           |
| `endTime`      | `LocalDateTime` | 生效结束时间           |
| `status`       | `String`        | 状态（0-正常, 9-冻结） |
| `gmtCreate`    | `LocalDateTime` | 创建时间               |
| `gmtModified`  | `LocalDateTime` | 更新时间               |

**SysTenantDropdownResponse**（下拉）

| 字段     | 类型     | 说明     |
| -------- | -------- | -------- |
| `id`     | `Long`   | 租户 ID  |
| `name`   | `String` | 租户名称 |
| `code`   | `String` | 租户编码 |
| `status` | `String` | 状态     |

### 地区

**SysAreaListResponse / DetailResponse**（字段一致）

| 字段         | 类型     | 说明                             |
| ------------ | -------- | -------------------------------- |
| `id`         | `Long`   | 地区 ID                          |
| `pid`        | `Long`   | 父节点 ID                        |
| `name`       | `String` | 地区名称                         |
| `adcode`     | `Long`   | 高德区域编码                     |
| `areaType`   | `String` | 类型（0-国家, 1-省, 2-市, 3-区） |
| `areaStatus` | `String` | 状态（0-停用, 1-启用）           |
| `cityCode`   | `String` | 城市编码                         |

### 应用

**SysAppListResponse**（列表）

| 字段     | 类型     | 说明     |
| -------- | -------- | -------- |
| `id`     | `Long`   | 应用 ID  |
| `code`   | `String` | 应用编码 |
| `name`   | `String` | 应用名称 |
| `icon`   | `String` | 应用图标 |
| `status` | `String` | 状态     |

**SysAppDetailResponse**（详情）

在 ListResponse 基础上额外返回：

| 字段          | 类型            | 说明     |
| ------------- | --------------- | -------- |
| `description` | `String`        | 应用描述 |
| `gmtCreate`   | `LocalDateTime` | 创建时间 |
| `gmtModified` | `LocalDateTime` | 更新时间 |

**SysAppDropdownResponse**（下拉）

| 字段   | 类型     | 说明     |
| ------ | -------- | -------- |
| `id`   | `Long`   | 应用 ID  |
| `code` | `String` | 应用编码 |
| `name` | `String` | 应用名称 |

### 租户应用订阅

**SysTenantAppListResponse**

| 字段        | 类型            | 说明                 |
| ----------- | --------------- | -------------------- |
| `id`        | `Long`          | 记录 ID              |
| `tenantId`  | `Long`          | 租户 ID              |
| `appId`     | `Long`          | 应用 ID              |
| `appCode`   | `String`        | 应用编码（富化字段） |
| `appName`   | `String`        | 应用名称（富化字段） |
| `appIcon`   | `String`        | 应用图标（富化字段） |
| `status`    | `String`        | 状态                 |
| `gmtCreate` | `LocalDateTime` | 创建时间             |

---

## 查询参数（Query Params）

所有分页查询均继承 `AdapterBaseListQuery`，包含通用分页参数：

| 参数       | 类型  | 默认值 | 说明     |
| ---------- | ----- | ------ | -------- |
| `pageNo`   | `int` | `1`    | 页码     |
| `pageSize` | `int` | `10`   | 每页条数 |

各资源查询支持的过滤参数（作为 query string 传递）：

| 资源   | 常用过滤参数                                           |
| ------ | ------------------------------------------------------ |
| 用户   | `username`, `phone`, `groupId`, `tenantId`, `lockFlag` |
| 角色   | `roleName`, `roleCode`                                 |
| 菜单   | `name`, `menuType`, `visible`                          |
| 分组   | `name`                                                 |
| 租户   | `name`, `code`, `status`                               |
| 地区   | `name`, `areaType`, `pid`, `adcode`                    |
| 日志   | `logType`, `title`, `createBy`, `serviceId`            |
| 国际化 | `code`（模糊匹配）, `language`（精确匹配）             |
| 应用   | `appName`（直接 `@RequestParam`，非 AdapterListQuery） |

> 未列出的资源（审计日志、文件、文件分组、公共参数、路由配置、OAuth 客户端）支持按自身字段过滤，前端按需传递即可。

---

## 接口风格说明

- **User / Role 的 PUT** 不带 `/{id}` 路径参数，ID 包含在请求体中；返回 `JsonResult<Boolean>`
- **User / Role 的 DELETE** 返回 `JsonResult<Boolean>`
- **其余资源的 PUT / DELETE** 均使用 `/{id}` 路径参数，返回 `JsonResult<Void>`
- **批量删除** 统一使用 DELETE 方法 + 请求体 `List<Long>` IDs
- **分页查询** 使用 query string 传参（`@ModelAttribute`）
- **创建 / 更新** 使用 JSON body（`@RequestBody`）
- **所有下拉接口** 不分页，返回完整列表
- **树形接口**（Menu/Group/Area）返回嵌套 `children` 结构
