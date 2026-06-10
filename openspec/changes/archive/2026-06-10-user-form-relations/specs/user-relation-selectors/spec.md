## ADDED Requirements

### Requirement: 用户表单分组选择器

用户表单 SHALL 包含分组选择器，以树形单选方式展示分组层级结构，选中后回填 `groupId` 字段。

#### Scenario: 创建用户时选择分组

- **WHEN** 用户打开创建用户表单
- **THEN** 表单包含一个分组选择器，数据来源 `GET /api/v1/sys/group/tree`，以树形结构展示分组层级

#### Scenario: 选中分组节点

- **WHEN** 用户在分组树中点击某个分组节点
- **THEN** 选择器显示该分组名称，表单 `groupId` 字段设为该节点 ID

#### Scenario: 编辑用户时预填分组

- **WHEN** 用户点击编辑按钮，当前用户已有 `groupId`
- **THEN** 分组选择器预选对应分组节点并显示其名称

#### Scenario: 分组数据加载失败

- **WHEN** `groupApi.getTree()` 请求失败
- **THEN** 分组选择器显示空状态提示，不影响其他字段正常使用

### Requirement: 用户表单角色多选器

用户表单 SHALL 包含角色多选器，允许选择多个角色，选中后回填 `roleIds` 字段。

#### Scenario: 创建用户时选择角色

- **WHEN** 用户打开创建用户表单
- **THEN** 表单包含一个角色多选器，数据来源 `GET /api/v1/sys/role/dropdown`，展示角色列表（id、roleName、roleCode）

#### Scenario: 多选角色

- **WHEN** 用户勾选多个角色
- **THEN** 选择器展示已选角色名称，表单 `roleIds` 字段包含所选角色的 ID 数组

#### Scenario: 取消选择角色

- **WHEN** 用户取消已勾选的角色
- **THEN** 该角色 ID 从 `roleIds` 中移除，选择器展示中移除该角色名称

#### Scenario: 编辑用户时预填角色

- **WHEN** 用户点击编辑按钮，当前用户已有 `roleIds`
- **THEN** 角色多选器预选对应角色节点

#### Scenario: 角色数据加载失败

- **WHEN** `roleApi.getDropdown()` 请求失败
- **THEN** 角色选择器显示空状态提示，不影响其他字段正常使用

### Requirement: 用户表单租户下拉（平台管理员专属）

用户表单 SHALL 在当前登录用户为平台管理员时展示租户下拉选择器，选中后回填 `tenantId` 字段。租户管理员不展示此字段（后端从 JWT 自动解析 tenantId）。

#### Scenario: 平台管理员创建用户时选择租户

- **WHEN** 当前登录用户角色为 `platform_admin` 且用户打开创建用户表单
- **THEN** 表单包含一个租户下拉选择器，数据来源 `GET /api/v1/sys/tenant/dropdown`，展示租户列表（id、name、code、status）

#### Scenario: 平台管理员选中租户

- **WHEN** 用户在租户下拉中选择某个租户
- **THEN** 选择器显示该租户名称，表单 `tenantId` 字段设为该租户 ID

#### Scenario: 租户管理员不显示租户选择器

- **WHEN** 当前登录用户角色为 `tenant_admin`
- **THEN** 用户表单不显示租户下拉选择器，`tenantId` 不随表单提交

#### Scenario: 编辑用户时预填租户

- **WHEN** 平台管理员点击编辑按钮，当前用户已有 `tenantId`
- **THEN** 租户下拉预选对应租户
