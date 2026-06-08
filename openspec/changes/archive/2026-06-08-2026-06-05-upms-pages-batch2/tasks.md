## 0. 基础设施

- [x] 0.1 新建 `src/components/tree-table.tsx`，实现 `TreeTable<T>` 组件：支持 `data`（带 `children` 的树形数组）、`columns`（复用 `DataTableColumn` 类型）、展开/折叠行、操作列插槽、可选 `onLoadChildren` 懒加载回调
- [x] 0.2 验证 TreeTable 组件在 `pnpm dev` 下正常渲染（用 mock 树形数据测试展开/折叠）

## 1. i18n 管理（最简单，独立）

- [x] 1.1 新建 `src/types/i18n.ts`：`SysI18nQuery`、`SysI18nRequest`、`SysI18nListResponse`、`SysI18nDetailResponse`，字段对齐 `docs/04-frontend/upms-api.md`
- [x] 1.2 新建 `src/api/modules/i18n.ts`：`getPage`、`getById`、`create`、`update`、`remove`
- [x] 1.3 新建 `src/i18n/locales/zh-CN/i18n.json`：翻译 key（title、description、code、language、content、searchCode、addI18n、formTitle、confirmDelete 等）
- [x] 1.4 新建 `mock/i18n.ts`：分页查询、详情、CRUD mock，含 code+language 唯一校验
- [x] 1.5 新建 `src/pages/system/i18n/columns.tsx`：列定义（code、language、content、操作）
- [x] 1.6 新建 `src/pages/system/i18n/i18n-form.tsx`：表单（code、language 下拉选择、content textarea），编辑时 code+language 不可修改
- [x] 1.7 新建 `src/pages/system/i18n/I18nManagement.tsx`：页面组件，搜索栏（code 模糊搜索、language 精确筛选），DataTable + FormModal
- [x] 1.8 更新 `src/types/index.ts` 添加 i18n 类型导出，更新 `mock/index.ts` 注册 mock
- [x] 1.9 `pnpm dev` 验证：访问 i18n 管理页面，完整 CRUD 流程跑通

## 2. 角色管理

- [x] 2.1 类型已有 `src/types/role.ts`，确认字段完整（含 dsType、dsScope、menuIds）
- [x] 2.2 API 模块已有 `src/api/modules/role.ts`，确认方法完整
- [x] 2.3 新建 `src/i18n/locales/zh-CN/role.json`：翻译 key（title、description、roleName、roleCode、roleDesc、dsType、dsScope、menuIds、searchName、addRole、formTitle、confirmDelete 等）
- [x] 2.4 新建 `mock/role.ts`（如尚不存在）：分页查询、详情（含 menuIds）、CRUD、dropdown mock
- [x] 2.5 新建 `src/pages/system/role/columns.tsx`：列定义（roleName、roleCode、roleDesc、dsType、gmtCreate、操作）
- [x] 2.6 新建 `src/pages/system/role/role-form.tsx`：表单（roleName、roleCode、roleDesc、dsType 下拉、dsScope、menuIds 用 TreeSelect 多选加载 menuApi.getTree()），编辑时预填 menuIds
- [x] 2.7 新建 `src/pages/system/role/RoleManagement.tsx`：页面组件，搜索栏（roleName、roleCode），DataTable + FormModal
- [x] 2.8 `pnpm dev` 验证：访问角色管理页面，完整 CRUD 流程跑通

## 3. OAuth 客户端管理

- [x] 3.1 新建 `src/types/oauthClient.ts`：`SysOauthClientQuery`、`SysOauthClientRequest`、`SysOauthClientListResponse`、`SysOauthClientDetailResponse`
- [x] 3.2 新建 `src/api/modules/oauthClient.ts`：`getPage`、`getById`、`create`、`update`、`remove`
- [x] 3.3 新建 `src/i18n/locales/zh-CN/oauthClient.json`：翻译 key
- [x] 3.4 新建 `mock/oauthClient.ts`：mock 数据
- [x] 3.5 新建 `src/pages/system/oauth-client/columns.tsx`：列定义（clientId、scope、authorizedGrantTypes、webServerRedirectUri、tenantId、操作）
- [x] 3.6 新建 `src/pages/system/oauth-client/oauth-client-form.tsx`：表单（clientId、clientSecret、scope、authorizedGrantTypes 多选 checkbox、webServerRedirectUri、accessTokenValidity、refreshTokenValidity、autoapprove、tenantId 下拉加载 tenantApi.getDropdown()、userType）
- [x] 3.7 新建 `src/pages/system/oauth-client/OAuthClientManagement.tsx`：页面组件
- [x] 3.8 更新 `src/types/index.ts`、`mock/index.ts`
- [x] 3.9 `pnpm dev` 验证

## 4. 区域管理（树形）

- [x] 4.1 新建 `src/types/area.ts`：`SysAreaQuery`、`SysAreaRequest`、`SysAreaListResponse`（含 children）、`SysAreaDetailResponse`
- [x] 4.2 新建 `src/api/modules/area.ts`：`getPage`、`getTree`、`getChildren`、`getById`、`create`、`update`、`remove`
- [x] 4.3 新建 `src/i18n/locales/zh-CN/area.json`：翻译 key（含 areaType 枚举：国家/省/市/区）
- [x] 4.4 新建 `mock/area.ts`：树形 mock 数据（含 children 嵌套）、懒加载 children mock
- [x] 4.5 新建 `src/pages/system/area/columns.tsx`：列定义（name、adcode、areaType、areaStatus、cityCode、操作）
- [x] 4.6 新建 `src/pages/system/area/area-form.tsx`：表单（name、pid TreeSelect 父节点、adcode、areaType 下拉、areaStatus 下拉、cityCode）
- [x] 4.7 新建 `src/pages/system/area/AreaManagement.tsx`：使用 TreeTable 组件，搜索栏（name、areaType 筛选），工具栏新增按钮
- [x] 4.8 更新 `src/types/index.ts`、`mock/index.ts`
- [x] 4.9 `pnpm dev` 验证：树形展示、展开折叠、CRUD 流程跑通

## 5. 菜单管理（树形，最复杂）

- [x] 5.1 类型已有 `src/types/menu.ts`，确认字段完整（含 menuType、visible、keepAlive、embedded、children）
- [x] 5.2 API 模块已有 `src/api/modules/menu.ts`，确认方法完整
- [x] 5.3 新建 `src/i18n/locales/zh-CN/menu.json`：翻译 key（含 menuType 枚举：菜单/按钮，visible 枚举，keepAlive 枚举）
- [x] 5.4 新建 `mock/menu.ts`（如尚不存在）：树形 mock 数据、CRUD mock
- [x] 5.5 新建 `src/pages/system/menu/columns.tsx`：列定义（name、permission、path、component、icon、sortOrder、menuType、visible、操作）
- [x] 5.6 新建 `src/pages/system/menu/menu-form.tsx`：表单，menuType 切换控制字段显隐（菜单类型显示 path/component/icon/visible/keepAlive/embedded，按钮类型仅显示 name/permission），pid TreeSelect 父菜单
- [x] 5.7 新建 `src/pages/system/menu/MenuManagement.tsx`：使用 TreeTable 组件，搜索栏（name、menuType 筛选）
- [x] 5.8 `pnpm dev` 验证：树形展示、菜单/按钮类型切换、CRUD 流程跑通

## 6. 路由配置管理

- [x] 6.1 新建 `src/types/routeConf.ts`：`SysRouteConfQuery`、`SysRouteConfRequest`、`SysRouteConfListResponse`、`SysRouteConfDetailResponse`
- [x] 6.2 新建 `src/api/modules/routeConf.ts`：`getPage`、`getById`、`create`、`update`、`remove`
- [x] 6.3 新建 `src/i18n/locales/zh-CN/routeConf.json`：翻译 key
- [x] 6.4 新建 `mock/routeConf.ts`：mock 数据（predicates/filters/metadata 为 JSON 字符串）
- [x] 6.5 新建 `src/pages/system/route-conf/columns.tsx`：列定义（routeId、routeName、uri、sortOrder、操作）
- [x] 6.6 新建 `src/pages/system/route-conf/route-conf-form.tsx`：表单（routeId、routeName、predicates textarea、filters textarea、uri、sortOrder、metadata textarea），JSON 字段用 textarea + 基本格式校验
- [x] 6.7 新建 `src/pages/system/route-conf/RouteConfManagement.tsx`：页面组件，搜索栏（routeName）
- [x] 6.8 更新 `src/types/index.ts`、`mock/index.ts`
- [x] 6.9 `pnpm dev` 验证

## 7. 路由 & 菜单注册

- [x] 7.1 在 `src/App.tsx` 的 `sharedRoutes` 中新增 6 个路由条目，`allowedRoles` 暂设 `['platform_admin', 'tenant_admin']`
- [x] 7.2 在 `src/routes/config.ts` 中新增 6 个路由的元数据（面包屑路径、页面标题 i18n key）
- [x] 7.3 在 `src/stores/menuStore.ts` 的 `ALL_MENUS` 中新增 6 个菜单项（对应 system 子菜单分组）
- [x] 7.4 更新 `src/i18n/locales/zh-CN/layout.json` 添加新菜单项的翻译 key
- [x] 7.5 `pnpm dev` 验证：所有新页面可通过侧边栏菜单访问，面包屑正确显示

## 8. 清理 & 验证

- [x] 8.1 `pnpm type-check` 无错误
- [x] 8.2 `pnpm lint` 无新增错误
- [x] 8.3 `pnpm dev` 完整验证：登录 → 逐个访问 6 个新页面 → 完整 CRUD 流程 → 登出
