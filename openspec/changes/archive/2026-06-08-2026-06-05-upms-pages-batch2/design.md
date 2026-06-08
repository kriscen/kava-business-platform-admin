## File Changes

### New Files

| File                                                      | Type      | Description                        |
| --------------------------------------------------------- | --------- | ---------------------------------- |
| `src/components/tree-table.tsx`                           | Component | 通用树形数据表格组件               |
| `src/pages/system/role/RoleManagement.tsx`                | Page      | 角色管理页面                       |
| `src/pages/system/role/columns.tsx`                       | Config    | 角色表格列定义                     |
| `src/pages/system/role/role-form.tsx`                     | Component | 角色表单（含 menu tree 多选）      |
| `src/pages/system/menu/MenuManagement.tsx`                | Page      | 菜单管理页面（TreeTable）          |
| `src/pages/system/menu/columns.tsx`                       | Config    | 菜单表格列定义                     |
| `src/pages/system/menu/menu-form.tsx`                     | Component | 菜单表单（菜单/按钮类型切换）      |
| `src/pages/system/area/AreaManagement.tsx`                | Page      | 区域管理页面（TreeTable）          |
| `src/pages/system/area/columns.tsx`                       | Config    | 区域表格列定义                     |
| `src/pages/system/area/area-form.tsx`                     | Component | 区域表单                           |
| `src/pages/system/i18n/I18nManagement.tsx`                | Page      | i18n 管理页面                      |
| `src/pages/system/i18n/columns.tsx`                       | Config    | i18n 表格列定义                    |
| `src/pages/system/i18n/i18n-form.tsx`                     | Component | i18n 表单                          |
| `src/pages/system/route-conf/RouteConfManagement.tsx`     | Page      | 路由配置管理页面                   |
| `src/pages/system/route-conf/columns.tsx`                 | Config    | 路由配置表格列定义                 |
| `src/pages/system/route-conf/route-conf-form.tsx`         | Component | 路由配置表单（含 JSON 编辑）       |
| `src/pages/system/oauth-client/OAuthClientManagement.tsx` | Page      | OAuth 客户端管理页面               |
| `src/pages/system/oauth-client/columns.tsx`               | Config    | OAuth 客户端表格列定义             |
| `src/pages/system/oauth-client/oauth-client-form.tsx`     | Component | OAuth 客户端表单（含多选授权类型） |
| `src/api/modules/area.ts`                                 | API       | 区域 API 模块                      |
| `src/api/modules/i18n.ts`                                 | API       | i18n API 模块                      |
| `src/api/modules/routeConf.ts`                            | API       | 路由配置 API 模块                  |
| `src/api/modules/oauthClient.ts`                          | API       | OAuth 客户端 API 模块              |
| `src/types/area.ts`                                       | Types     | 区域类型定义                       |
| `src/types/i18n.ts`                                       | Types     | i18n 类型定义                      |
| `src/types/routeConf.ts`                                  | Types     | 路由配置类型定义                   |
| `src/types/oauthClient.ts`                                | Types     | OAuth 客户端类型定义               |
| `src/i18n/locales/zh-CN/role.json`                        | i18n      | 角色管理翻译                       |
| `src/i18n/locales/zh-CN/menu.json`                        | i18n      | 菜单管理翻译                       |
| `src/i18n/locales/zh-CN/area.json`                        | i18n      | 区域管理翻译                       |
| `src/i18n/locales/zh-CN/i18n.json`                        | i18n      | i18n 管理翻译                      |
| `src/i18n/locales/zh-CN/routeConf.json`                   | i18n      | 路由配置翻译                       |
| `src/i18n/locales/zh-CN/oauthClient.json`                 | i18n      | OAuth 客户端翻译                   |
| `mock/area.ts`                                            | Mock      | 区域 mock 数据                     |
| `mock/i18n.ts`                                            | Mock      | i18n mock 数据                     |
| `mock/routeConf.ts`                                       | Mock      | 路由配置 mock 数据                 |
| `mock/oauthClient.ts`                                     | Mock      | OAuth 客户端 mock 数据             |

### Modified Files

| File                   | Change                                        |
| ---------------------- | --------------------------------------------- |
| `src/types/index.ts`   | 新增 area/i18n/routeConf/oauthClient 类型导出 |
| `src/App.tsx`          | 新增 6 个路由条目到 sharedRoutes              |
| `src/routes/config.ts` | 新增 6 个路由的元数据配置（面包屑、标题）     |
| `mock/index.ts`        | 注册新的 mock 文件                            |
| `mock/role.ts`         | 新建或补充角色 mock（如尚不存在）             |
| `mock/menu.ts`         | 新建或补充菜单 mock（如尚不存在）             |

## Dependencies

```
tree-table (基础组件)
    ├── MenuManagement
    └── AreaManagement

menuApi.getTree() (已有)
    └── role-form (menuIds 多选)

tenantApi.getDropdown() (已有)
    └── oauthClient-form (tenantId 选择)
```

## API Contracts

### Area API (`/api/v1/sys/area/`)

```
GET  /page       ?pageNo&pageSize&name&areaType     → PagingInfo<SysAreaListResponse>
GET  /tree       ?areaType                           → List<Tree<Long>>
GET  /children   ?pid                                → List<SysAreaListResponse>
GET  /{id}                                           → SysAreaDetailResponse
POST /             SysAreaRequest                     → Long
PUT  /{id}         SysAreaRequest                     → Void
DELETE/             List<Long>                        → Void
```

### i18n API (`/api/v1/sys/i18n/`)

```
GET  /page       ?pageNo&pageSize&code&language      → PagingInfo<SysI18nListResponse>
GET  /{id}                                           → SysI18nDetailResponse
POST /             SysI18nRequest (code+language 唯一) → Long
PUT  /{id}         SysI18nRequest                     → Void
DELETE/             List<Long>                        → Void
```

### RouteConf API (`/api/v1/sys/route-conf/`)

```
GET  /page       ?pageNo&pageSize&routeName          → PagingInfo<SysRouteConfListResponse>
GET  /{id}                                           → SysRouteConfDetailResponse
POST /             SysRouteConfRequest                → Long
PUT  /{id}         SysRouteConfRequest                → Void
DELETE/             List<Long>                        → Void
```

### OAuthClient API (`/api/v1/sys/oauth-client/`)

```
GET  /page       ?pageNo&pageSize&clientId           → PagingInfo<SysOauthClientListResponse>
GET  /{id}                                           → SysOauthClientDetailResponse
POST /             SysOauthClientRequest              → Long
PUT  /{id}         SysOauthClientRequest              → Void
DELETE/             List<Long>                        → Void
```

### Role API (`/api/v1/sys/role/`) — 已有，补全页面

```
GET  /page       ?pageNo&pageSize&roleName&roleCode  → PagingInfo<SysRoleListResponse>
GET  /{id}                                           → SysRoleDetailResponse (含 menuIds)
POST /             SysRoleRequest                     → Long
PUT  /             SysRoleRequest (含 id)             → Boolean
DELETE/             List<Long>                        → Boolean
GET  /dropdown                                       → List<SysRoleDropdownResponse>
```

### Menu API (`/api/v1/sys/menu/`) — 已有，补全页面

```
GET  /page       ?pageNo&pageSize&name&menuType      → PagingInfo<SysMenuListResponse>
GET  /{id}                                           → SysMenuDetailResponse
POST /             SysMenuRequest                     → Long
PUT  /{id}         SysMenuRequest                     → Void
DELETE/             List<Long>                        → Void
GET  /tree                                           → List<SysMenuListResponse> (树形)
```
