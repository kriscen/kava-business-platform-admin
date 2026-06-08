# CRUD Management Pages Spec

## Purpose

系统管理 CRUD 页面的统一模式：使用 DataTable/FormModal 或 TreeTable/FormModal + 批量删除 + i18n 构建管理页面，覆盖部门、租户、公共参数、角色、菜单、区域、i18n、路由配置、OAuth 客户端共 9 个实体。

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

### Requirement: 角色管理页面

系统 SHALL 展示角色分页列表，支持 CRUD 和菜单权限分配。

#### Scenario: 角色列表加载

- **WHEN** 用户访问 `/platform/system/role`
- **THEN** 系统调用 `GET /api/v1/sys/role/page?pageNo=1&pageSize=10` 展示分页表格，列包含：角色名称 (roleName)、角色编码 (roleCode)、角色描述 (roleDesc)、数据权限类型 (dsType)、创建时间 (gmtCreate)、操作（编辑/删除）

#### Scenario: 角色名称和编码搜索

- **WHEN** 用户在搜索栏输入角色名称或编码
- **THEN** 系统调用 `GET /api/v1/sys/role/page?roleName={name}&roleCode={code}` 展示过滤结果

#### Scenario: 创建角色（含菜单权限）

- **WHEN** 用户填写角色信息，从菜单树多选组件选择关联菜单，点击确认
- **THEN** 系统调用 `POST /api/v1/sys/role` 发送 `{ roleName, roleCode, roleDesc, dsType, dsScope, menuIds }`，成功后刷新列表

#### Scenario: 编辑角色（预填菜单权限）

- **WHEN** 用户点击编辑按钮
- **THEN** 系统调用 `GET /api/v1/sys/role/{id}` 获取详情（含 menuIds），表单预填所有字段，菜单树多选组件预选已关联菜单

#### Scenario: 批量删除角色

- **WHEN** 用户勾选多个角色行，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/role` 发送选中 ID 数组，成功后刷新列表

### Requirement: 菜单管理页面

系统 SHALL 以树形结构展示菜单，支持 CRUD 和菜单/按钮类型区分。

#### Scenario: 菜单树形加载

- **WHEN** 用户访问 `/platform/system/menu`
- **THEN** 系统调用 `GET /api/v1/sys/menu/tree` 获取树形数据，使用 TreeTable 组件展示，列包含：菜单名称 (name)、权限标识 (permission)、路由路径 (path)、组件路径 (component)、图标 (icon)、排序 (sortOrder)、菜单类型 (menuType)、可见性 (visible)、操作（编辑/删除/新增子菜单）

#### Scenario: 菜单名称和类型搜索

- **WHEN** 用户在搜索栏输入菜单名称或选择菜单类型
- **THEN** 系统过滤树形数据（前端过滤或后端 page 接口）

#### Scenario: 创建菜单类型

- **WHEN** 用户选择菜单类型为"菜单"，填写 name、path、component、icon、sortOrder、visible、keepAlive、embedded
- **THEN** 系统调用 `POST /api/v1/sys/menu` 发送数据，menuType 为 "0"

#### Scenario: 创建按钮类型

- **WHEN** 用户选择菜单类型为"按钮"，仅填写 name 和 permission
- **THEN** 系统调用 `POST /api/v1/sys/menu` 发送数据，menuType 为 "1"，path/component/icon 等字段为空

#### Scenario: 菜单类型切换控制表单字段

- **WHEN** 用户在表单中切换 menuType
- **THEN** 菜单类型显示 path、component、icon、visible、keepAlive、embedded 字段；按钮类型隐藏这些字段，仅显示 name 和 permission

#### Scenario: 编辑菜单

- **WHEN** 用户点击编辑按钮
- **THEN** 系统调用 `GET /api/v1/sys/menu/{id}` 获取详情，表单预填，根据 menuType 显示对应字段

#### Scenario: 删除菜单（级联检查）

- **WHEN** 用户点击删除按钮
- **THEN** 系统调用 `DELETE /api/v1/sys/menu`，如有子菜单后端返回错误提示

### Requirement: 区域管理页面

系统 SHALL 以树形结构展示区域层级，支持 CRUD 和按类型筛选。

#### Scenario: 区域树形加载

- **WHEN** 用户访问 `/platform/system/area`
- **THEN** 系统调用 `GET /api/v1/sys/area/tree` 获取树形数据，使用 TreeTable 组件展示，列包含：地区名称 (name)、高德编码 (adcode)、类型 (areaType)、状态 (areaStatus)、城市编码 (cityCode)、操作（编辑/删除/新增子区域）

#### Scenario: 区按类型筛选

- **WHEN** 用户在搜索栏选择 areaType（国家/省/市/区）
- **THEN** 系统调用 `GET /api/v1/sys/area/tree?areaType={type}` 展示过滤后的树

#### Scenario: 创建区域

- **WHEN** 用户填写区域信息（name、pid TreeSelect 父节点、adcode、areaType、areaStatus、cityCode），点击确认
- **THEN** 系统调用 `POST /api/v1/sys/area` 发送数据，成功后刷新树

#### Scenario: 编辑区域

- **WHEN** 用户点击编辑按钮
- **THEN** 系统调用 `GET /api/v1/sys/area/{id}` 获取详情，表单预填

#### Scenario: 删除区域

- **WHEN** 用户点击删除按钮并确认
- **THEN** 系统调用 `DELETE /api/v1/sys/area`

### Requirement: i18n 管理页面

系统 SHALL 展示国际化 KV 数据分页列表，支持 CRUD。

#### Scenario: i18n 列表加载

- **WHEN** 用户访问 `/platform/system/i18n`
- **THEN** 系统调用 `GET /api/v1/sys/i18n/page?pageNo=1&pageSize=10` 展示分页表格，列包含：编码 (code)、语言 (language)、内容 (content)、操作（编辑/删除）

#### Scenario: i18n 按编码和语言搜索

- **WHEN** 用户在搜索栏输入 code 或选择 language
- **THEN** 系统调用 `GET /api/v1/sys/i18n/page?code={code}&language={lang}` 展示过滤结果

#### Scenario: 创建 i18n 条目

- **WHEN** 用户填写 code、language（下拉选择）、content，点击确认
- **THEN** 系统调用 `POST /api/v1/sys/i18n` 发送数据，code+language 联合唯一

#### Scenario: 编辑 i18n 条目

- **WHEN** 用户点击编辑按钮
- **THEN** code 和 language 字段不可修改，仅可编辑 content

#### Scenario: 批量删除 i18n

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/i18n` 发送选中 ID 数组，成功后刷新列表

### Requirement: 路由配置管理页面

系统 SHALL 展示网关路由配置分页列表，支持 CRUD，含 JSON 字段编辑。

#### Scenario: 路由配置列表加载

- **WHEN** 用户访问 `/platform/system/route-conf`
- **THEN** 系统调用 `GET /api/v1/sys/route-conf/page?pageNo=1&pageSize=10` 展示分页表格，列包含：路由 ID (routeId)、路由名称 (routeName)、URI (uri)、排序 (sortOrder)、操作（编辑/删除）

#### Scenario: 路由名称搜索

- **WHEN** 用户在搜索栏输入 routeName
- **THEN** 系统调用 `GET /api/v1/sys/route-conf/page?routeName={name}` 展示过滤结果

#### Scenario: 创建路由配置

- **WHEN** 用户填写 routeId、routeName、predicates（JSON textarea）、filters（JSON textarea）、uri、sortOrder、metadata（JSON textarea），点击确认
- **THEN** 系统调用 `POST /api/v1/sys/route-conf` 发送数据

#### Scenario: 编辑路由配置

- **WHEN** 用户点击编辑按钮
- **THEN** 表单预填所有字段，JSON 字段在 textarea 中展示原始 JSON

#### Scenario: 批量删除路由配置

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/route-conf` 发送选中 ID 数组，成功后刷新列表

### Requirement: OAuth 客户端管理页面

系统 SHALL 展示 OAuth2 客户端分页列表，支持 CRUD 和多选授权类型。

#### Scenario: OAuth 客户端列表加载

- **WHEN** 用户访问 `/platform/system/oauth-client`
- **THEN** 系统调用 `GET /api/v1/sys/oauth-client/page?pageNo=1&pageSize=10` 展示分页表格，列包含：客户端 ID (clientId)、授权范围 (scope)、授权类型 (authorizedGrantTypes)、回调地址 (webServerRedirectUri)、所属租户 (tenantId)、操作（编辑/删除）

#### Scenario: 客户端 ID 搜索

- **WHEN** 用户在搜索栏输入 clientId
- **THEN** 系统调用 `GET /api/v1/sys/oauth-client/page?clientId={id}` 展示过滤结果

#### Scenario: 创建 OAuth 客户端

- **WHEN** 用户填写所有字段，authorizedGrantTypes 通过多选 checkbox 选择（authorization_code、refresh_token、client_credentials、password），点击确认
- **THEN** 系统调用 `POST /api/v1/sys/oauth-client` 发送数据

#### Scenario: 编辑 OAuth 客户端

- **WHEN** 用户点击编辑按钮
- **THEN** 表单预填所有字段，clientSecret 显示为掩码或空（需确认后端行为），authorizedGrantTypes 预选已选项

#### Scenario: 批量删除 OAuth 客户端

- **WHEN** 用户勾选多条记录，点击批量删除，确认弹窗后执行
- **THEN** 系统调用 `DELETE /api/v1/sys/oauth-client` 发送选中 ID 数组，成功后刷新列表

### Requirement: TreeTable 组件

系统 SHALL 提供通用树形数据表格组件，支持展开/折叠和列定义复用。

#### Scenario: 树形数据渲染

- **WHEN** 父组件传入带 `children` 的数组数据
- **THEN** TreeTable 递归渲染所有层级，每行显示展开/折叠箭头，缩进表示层级关系

#### Scenario: 展开/折叠交互

- **WHEN** 用户点击某行的展开箭头
- **THEN** 该行的子节点显示出来；再次点击折叠

#### Scenario: 懒加载子节点

- **WHEN** TreeTable 配置了 `onLoadChildren` 回调且某行无 children 数据
- **THEN** 点击展开时调用 `onLoadChildren(row)` 异步加载子节点，加载中显示 spinner

#### Scenario: 列定义兼容

- **WHEN** 使用 TreeTable 组件
- **THEN** 列定义类型与 DataTable 的 `DataTableColumn<T>` 完全一致，操作列 render 函数可用

### Requirement: CRUD 管理页 i18n 支持

所有管理页面的用户可见字符串 SHALL 通过 i18n `t()` 函数引用对应模块的翻译 key。

#### Scenario: 各模块页面 i18n

- **WHEN** 各模块页面渲染时
- **THEN** 表头、按钮文字、搜索标签、提示消息均通过 `t('<module>.xxx')` 引用，翻译文件放在 `src/i18n/locales/zh-CN/<module>.json`
- **THEN** 新增的日志、审计日志、文件、文件分组、应用管理 5 个模块均遵循此规范
