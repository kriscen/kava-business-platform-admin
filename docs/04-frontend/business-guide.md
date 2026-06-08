# 前端业务知识指南

> 本文档面向前端开发者，说明 Kava 平台的业务模型如何影响前端实现。API 详见 `upms-api.md`，认证流程详见 `auth-guide.md`。

---

## 1. 用户角色与 UI 分流

Kava 平台有两类用户，前端需要根据用户类型决定展示哪套界面。

### 角色类型

| 角色         | userType | 登录 Client | 使用入口             | 说明                             |
| ------------ | -------- | ----------- | -------------------- | -------------------------------- |
| 平台管理员   | 1 (B端)  | B端 Client  | Kava 管理后台        | 管理全局配置和租户元数据         |
| 租户管理员   | 1 (B端)  | B端 Client  | Kava 管理后台        | 管理所属家庭（租户）的成员和配置 |
| App 终端用户 | 2 (C端)  | C端 Client  | 各家庭独立开发的 App | C端用户不由 Kava 前端承载        |

### 平台管理员 vs 租户管理员

两者使用**同一套前端应用**，区别在于菜单自动分流：

```
登录后获取菜单树 GET /api/v1/sys/menu/tree
       │
       ├── 平台管理员（JWT roles 含 ROLE_ADMIN）
       │     → 返回 level=PLATFORM 的菜单
       │     → 看到：租户管理、应用管理、平台用户管理、全局配置
       │
       └── 租户管理员
             → 返回 level=TENANT 的菜单（按角色权限过滤）
             → 看到：用户管理、角色管理、分组管理、已购 App 菜单
```

> 前端**不需要判断**用户是平台管理员还是租户管理员来切换菜单——调用 `GET /menu/tree` 接口，后端自动返回该用户可见的菜单。

---

## 2. 菜单消费

### 获取菜单树

```
GET /api/v1/sys/menu/tree
Authorization: Bearer <access_token>
```

返回 `JsonResult<List<SysMenuListResponse>>`，结构示例：

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "系统管理",
      "pid": "0",
      "path": "/system",
      "component": null,
      "icon": "setting",
      "menuType": "0",
      "level": "PLATFORM",
      "permission": null,
      "visible": "0",
      "sortOrder": "1",
      "keepAlive": null,
      "embedded": null,
      "children": [
        {
          "id": "10",
          "name": "用户管理",
          "pid": "1",
          "path": "/system/user",
          "component": "system/user/index",
          "icon": "user",
          "menuType": "0",
          "level": "PLATFORM",
          "permission": "sys:user:list",
          "visible": "0",
          "sortOrder": "1",
          "keepAlive": "0",
          "embedded": null,
          "children": [
            {
              "id": "100",
              "name": "新增用户",
              "pid": "10",
              "path": null,
              "component": null,
              "icon": null,
              "menuType": "1",
              "level": "PLATFORM",
              "permission": "sys:user:add",
              "visible": "0",
              "sortOrder": "1",
              "keepAlive": null,
              "embedded": null,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### 字段含义与前端处理

| 字段         | 类型   | 前端用途                                                         |
| ------------ | ------ | ---------------------------------------------------------------- |
| `id`         | String | 菜单唯一标识                                                     |
| `name`       | String | 菜单显示名称                                                     |
| `pid`        | String | 父菜单 ID（`"0"` 或 null 表示根节点）                            |
| `path`       | String | 前端路由路径，用于 vue-router 注册                               |
| `component`  | String | 前端组件路径，如 `system/user/index`，用于动态导入               |
| `icon`       | String | 菜单图标名称                                                     |
| `menuType`   | String | `"0"` = 菜单（导航项），`"1"` = 按钮（权限控制用）               |
| `permission` | String | 权限标识，如 `sys:user:add`，用于按钮级权限控制                  |
| `visible`    | String | `"0"` = 隐藏，`"1"` = 可见                                       |
| `sortOrder`  | String | 排序值，升序排列                                                 |
| `keepAlive`  | String | `"0"` = 缓存页面组件，`"1"` = 不缓存                             |
| `embedded`   | String | 是否内嵌页面（iframe 方式打开）                                  |
| `level`      | String | `"PLATFORM"` 或 `"TENANT"`，前端通常无需关心（后端已按角色过滤） |
| `children`   | List   | 子菜单列表，递归结构                                             |

### 前端渲染流程

```
GET /menu/tree 返回数据
       │
       ▼
遍历树，过滤 menuType="0" 的节点 → 生成侧边栏导航
       │
       ▼
遍历树，收集所有 path + component → 动态注册 vue-router 路由
       │
       ▼
遍历树，收集所有 menuType="1" 的 permission → 存入权限列表
       │
       ▼
页面中用权限列表控制按钮显隐
```

### 菜单树的过滤逻辑（后端已处理）

前端**不需要做任何过滤**，后端已根据以下规则返回精确的菜单树：

- **平台管理员**（`ROLE_ADMIN`）：返回所有 `level=PLATFORM` 的菜单
- **租户管理员**：返回同时满足以下条件的菜单：
  - `level=TENANT`
  - 菜单属于该租户已订阅的 App（含 kava-base 系统应用）
  - 菜单已通过角色分配给该用户

---

## 3. 权限控制

### 权限标识

每个菜单（`menuType="1"` 的按钮）有一个 `permission` 字段，格式为 `模块:资源:操作`：

| 示例              | 含义         |
| ----------------- | ------------ |
| `sys:user:list`   | 查看用户列表 |
| `sys:user:add`    | 新增用户     |
| `sys:user:edit`   | 编辑用户     |
| `sys:user:delete` | 删除用户     |
| `sys:role:assign` | 分配角色权限 |

### 权限数据来源

权限标识有两个来源，前端需合并使用：

**来源 1：菜单树中的 permission**

从 `GET /menu/tree` 响应中收集所有 `menuType="1"` 节点的 `permission` 字段。

**来源 2：JWT Token 中的 roles**

解码 `access_token` 的 Payload，读取 `roles` 数组：

```json
{
  "roles": ["ROLE_ADMIN"]
}
```

> **注意**：`roles` 字段只包含角色编码，不包含细粒度权限标识。因此按钮级权限控制必须使用来源 1（菜单树的 `permission` 字段），不能仅依赖 JWT。

### 前端实现建议

```javascript
// 从菜单树收集权限列表
function collectPermissions(menus) {
  const permissions = new Set()
  function walk(nodes) {
    for (const node of nodes) {
      if (node.menuType === '1' && node.permission) {
        permissions.add(node.permission)
      }
      if (node.children?.length) {
        walk(node.children)
      }
    }
  }
  walk(menus)
  return permissions
}

// 按钮权限指令（Vue 示例）
// <button v-has="'sys:user:add'">新增</button>
app.directive('has', {
  mounted(el, binding) {
    if (!permissions.has(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
})
```

### 平台管理员特殊规则

平台管理员（`ROLE_ADMIN`）拥有**所有权限**，后端跳过权限检查。前端可以：

- 不显示 `ROLE_ADMIN` 在 roles 中时，直接放行所有按钮
- 或者正常走权限判断（平台管理员的菜单树包含所有平台级菜单，权限自然齐全）

---

## 4. 数据权限（dsType）

数据权限控制用户能看到哪些数据，由角色的 `dsType` 字段决定。

### dsType 枚举值

| dsType | 含义           | 后端过滤逻辑          | 前端需要做什么 |
| ------ | -------------- | --------------------- | -------------- |
| `"0"`  | 全部数据       | 不过滤                | 无需特殊处理   |
| `"1"`  | 自定义         | 按用户所在分组过滤\*  | 无需特殊处理   |
| `"2"`  | 本分组及子分组 | 按用户所在分组过滤\*  | 无需特殊处理   |
| `"3"`  | 仅本分组       | 按用户所在分组过滤    | 无需特殊处理   |
| `"4"`  | 仅本人数据     | 按 `creator` 字段过滤 | 无需特殊处理   |

> \*当前版本 dsType `"1"` `"2"` `"3"` 的后端实现相同（均按 `group_id` 过滤），`dsScope` 字段暂未生效。

### 前端是否需要感知数据权限？

**大部分场景不需要**。数据权限是后端在 SQL 层自动过滤的，前端调用列表接口时，返回的数据已经过过滤。

唯一可能需要前端配合的场景：

- **角色管理页面**：创建/编辑角色时，需要展示 `dsType` 和 `dsScope` 字段供管理员选择
- **数据范围选择器**：当 `dsType="1"`（自定义）时，理论上需要展示分组多选框让用户指定 `dsScope`（当前版本暂未实现此功能）

### 角色 API 中的 dsType

角色的创建/编辑接口已暴露 `dsType` 和 `dsScope` 字段：

```json
// POST /api/v1/sys/role
{
  "roleName": "数据管理员",
  "roleCode": "data_manager",
  "dsType": "4",
  "dsScope": null,
  "menuIds": ["10", "11", "12"]
}
```

| 字段      | 类型   | 说明                                        |
| --------- | ------ | ------------------------------------------- |
| `dsType`  | String | `"0"` ~ `"4"`，见上表                       |
| `dsScope` | String | 自定义范围时填写分组 ID（当前版本暂未生效） |

---

## 5. 租户与多租户

### 核心概念

- **一个家庭 = 一个租户**，所有业务数据通过 `tenant_id` 隔离
- **单账号单租户**：一个用户只能属于一个家庭
- 前端**不需要手动传递** `tenantId`——后端从 JWT Token 中自动解析

### 租户管理（仅平台管理员可见）

| API                                   | 说明                                                              |
| ------------------------------------- | ----------------------------------------------------------------- |
| `GET /api/v1/sys/tenant/page`         | 租户列表                                                          |
| `POST /api/v1/sys/tenant`             | 创建租户（可同时传入 `adminUsername`/`adminPassword` 创建管理员） |
| `PUT /api/v1/sys/tenant/{id}/enable`  | 启用租户                                                          |
| `PUT /api/v1/sys/tenant/{id}/disable` | 停用租户                                                          |
| `GET /api/v1/sys/tenant/dropdown`     | 租户下拉列表（不分页）                                            |

### 租户状态

| status | 含义 | 说明               |
| ------ | ---- | ------------------ |
| `"0"`  | 正常 | 可正常使用         |
| `"9"`  | 冻结 | 不可登录，不可操作 |

> 租户还有到期时间（`endTime`），到期后自动失效。后端综合 `status` 和 `endTime` 计算有效状态。

### 租户对前端的影响

| 场景       | 前端表现                                                         |
| ---------- | ---------------------------------------------------------------- |
| 租户正常   | 正常使用                                                         |
| 租户被冻结 | 接口返回 `AUTH_TENANT_INVALID`（`00030005`），前端提示联系管理员 |
| 租户到期   | 同上                                                             |
| 切换租户   | 不支持（单账号单租户），需要登录不同账号                         |

---

## 6. 应用（App）模型

### 核心概念

```
App（应用）
├── kava-base：系统内置应用，所有租户自动拥有，不可退订
├── ledger：记账 App（业务应用，需购买）
├── calendar：日程 App（业务应用，需购买）
└── ...
```

App 是**菜单的组合包**。租户订阅 App 后，该 App 包含的菜单对租户可见。

### 前端是否需要关心 App 模型？

**大部分场景不需要**。前端只需调用 `GET /menu/tree`，后端已根据租户的 App 订阅状态过滤菜单。

前端需要关心 App 模型的场景：

- **应用管理页面**（仅平台管理员）：管理 App 的增删改查
- **租户应用订阅页面**（仅平台管理员）：为租户订阅/退订 App

### 相关 API

| API                                                 | 说明               | 权限       |
| --------------------------------------------------- | ------------------ | ---------- |
| `GET /api/v1/sys/app/page`                          | 应用列表           | 平台管理员 |
| `GET /api/v1/sys/app/dropdown`                      | 应用下拉           | 平台管理员 |
| `POST /api/v1/sys/app`                              | 创建应用           | 平台管理员 |
| `PUT /api/v1/sys/app/{id}/menus`                    | 绑定应用菜单       | 平台管理员 |
| `GET /api/v1/sys/tenant/{tenantId}/apps`            | 租户已订阅应用列表 | 平台管理员 |
| `POST /api/v1/sys/tenant/{tenantId}/apps`           | 租户订阅应用       | 平台管理员 |
| `DELETE /api/v1/sys/tenant/{tenantId}/apps/{appId}` | 租户退订应用       | 平台管理员 |

### App 与菜单的关系

```
App A 包含菜单 [10, 20, 30]
App B 包含菜单 [20, 40, 50]
                 ↑
              菜单 20 被两个 App 复用

租户订阅 App A + App B
→ 可见菜单 = [10, 20, 30, 40, 50]（自动去重）
```

### 系统应用 kava-base

- 所有租户自动拥有，无需订阅
- 不可退订（调用退订接口会返回错误码 `10100002`）
- 包含用户管理、角色管理、分组管理等基础菜单

---

## 7. 分组（Group）

分组是租户内部的组织结构，用于数据权限隔离。

### 分组树

```
GET /api/v1/sys/group/tree
```

返回树形结构（与菜单树类似，`pid` 构建父子关系）。

### 分组与数据权限

- 用户归属一个分组（`sys_user.group_id`）
- 角色的 `dsType` 决定数据过滤范围，过滤条件基于分组
- 分组是 pid 树形结构，支持父子层级

### 前端使用场景

| 场景         | 说明                                                          |
| ------------ | ------------------------------------------------------------- |
| 用户管理     | 创建用户时选择分组（`groupId` 字段）                          |
| 分组管理     | 增删改查分组树                                                |
| 数据范围选择 | 角色编辑时，`dsType="1"` 需要选择分组范围（当前版本暂未实现） |

---

## 8. 菜单管理

### 菜单类型

| menuType | 含义 | 前端表现                       |
| -------- | ---- | ------------------------------ |
| `"0"`    | 菜单 | 侧边栏导航项，可点击进入页面   |
| `"1"`    | 按钮 | 不在导航中显示，仅用于权限控制 |

### 菜单层级

| level        | 含义       | 谁能管理   |
| ------------ | ---------- | ---------- |
| `"PLATFORM"` | 平台级菜单 | 平台管理员 |
| `"TENANT"`   | 租户级菜单 | 租户管理员 |

### 菜单管理 API

| API                         | 说明                           |
| --------------------------- | ------------------------------ |
| `GET /api/v1/sys/menu/page` | 菜单列表（分页）               |
| `GET /api/v1/sys/menu/tree` | 当前用户菜单树（已过滤）       |
| `GET /api/v1/sys/menu/{id}` | 菜单详情                       |
| `POST /api/v1/sys/menu`     | 创建菜单                       |
| `PUT /api/v1/sys/menu/{id}` | 更新菜单                       |
| `DELETE /api/v1/sys/menu`   | 批量删除（body: `List<Long>`） |

### 前端菜单管理页面注意事项

- 创建菜单时 `menuType` 必填（`"0"` 或 `"1"`）
- `pid` 为空或 `"0"` 表示根节点
- `path` 和 `component` 仅 `menuType="0"` 时有意义
- `permission` 仅 `menuType="1"` 时有意义
- 删除菜单前，后端会检查：是否有子菜单、是否被角色引用。违反时返回对应错误码

---

## 9. 常见前端交互场景

### 场景 1：用户登录后初始化

```
1. 用户输入用户名密码
2. POST /auth/oauth2/token 获取 Token
3. 解码 JWT，读取 userId、username、roles
4. GET /api/v1/sys/menu/tree 获取菜单树
5. 用菜单树渲染侧边栏 + 注册路由 + 收集权限列表
6. 进入默认页面
```

### 场景 2：创建用户

```
1. GET /api/v1/sys/role/dropdown → 获取角色下拉列表
2. GET /api/v1/sys/group/tree → 获取分组树
3. GET /api/v1/sys/tenant/dropdown → 获取租户下拉（仅平台管理员）
4. 用户填写表单
5. POST /api/v1/sys/user → 创建用户
```

### 场景 3：创建角色并分配菜单

```
1. GET /api/v1/sys/menu/tree → 获取菜单树（展示可选菜单）
2. 用户填写角色信息 + 勾选菜单 + 选择数据权限类型
3. POST /api/v1/sys/role → 创建角色（body 含 menuIds、dsType）
```

### 场景 4：租户订阅应用

```
1. GET /api/v1/sys/app/dropdown → 获取可选应用列表
2. 用户选择应用
3. POST /api/v1/sys/tenant/{tenantId}/apps → 订阅
4. 租户管理员下次登录时，菜单树自动包含新 App 的菜单
```

---

## 10. 错误码速查（前端常用）

| 错误码     | 含义                 | 前端处理建议                 |
| ---------- | -------------------- | ---------------------------- |
| `00030001` | 未认证（缺少 Token） | 跳转登录页                   |
| `00030002` | Token 已过期         | 尝试 refresh_token 刷新      |
| `00030004` | 权限不足             | 提示无权限，隐藏对应操作按钮 |
| `00030005` | 租户无效/已冻结      | 提示联系管理员               |
| `10020002` | 用户名已存在         | 表单校验提示                 |
| `10010002` | 角色编码已存在       | 表单校验提示                 |
| `10040002` | 租户编码已存在       | 表单校验提示                 |
| `10030005` | 菜单有子菜单不可删   | 提示先删除子菜单             |
| `10030006` | 菜单被角色引用不可删 | 提示先解除角色绑定           |
| `10050003` | 分组有子分组不可删   | 提示先删除子分组             |
| `10050004` | 分组被用户引用不可删 | 提示先迁移用户               |
| `10090003` | 系统应用不可删除     | 提示操作不允许               |
| `10100001` | 租户已订阅该应用     | 提示已订阅                   |
| `10100002` | 系统应用不可退订     | 提示操作不允许               |

完整错误码表见 `../04-reference/error-codes.md`。
