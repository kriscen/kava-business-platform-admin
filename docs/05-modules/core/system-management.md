# 系统管理页面

系统管理页面集中在 `src/pages/system/`，API 调用集中在 `src/api/modules/`，类型定义集中在 `src/types/`。页面层只组合搜索、表格、表单和操作按钮，不直接解析后端分页字段。

## 已实现页面

| 页面         | 路由片段              | API 模块         | 访问角色               |
| ------------ | --------------------- | ---------------- | ---------------------- |
| 用户管理     | `system/users`        | `userApi`        | 平台管理员             |
| 角色管理     | `system/role`         | `roleApi`        | 平台管理员、租户管理员 |
| 菜单管理     | `system/menu`         | `menuApi`        | 平台管理员、租户管理员 |
| 分组管理     | `system/group`        | `groupApi`       | 平台管理员             |
| 租户管理     | `system/tenant`       | `tenantApi`      | 平台管理员             |
| 地区管理     | `system/area`         | `areaApi`        | 平台管理员、租户管理员 |
| 国际化       | `system/i18n`         | `i18nApi`        | 平台管理员、租户管理员 |
| 公共参数     | `system/public-param` | `publicParamApi` | 平台管理员             |
| 路由配置     | `system/route-conf`   | `routeConfApi`   | 平台管理员、租户管理员 |
| OAuth 客户端 | `system/oauth-client` | `oauthClientApi` | 平台管理员、租户管理员 |
| 操作日志     | `system/log`          | `logApi`         | 平台管理员             |
| 审计日志     | `system/audit-log`    | `auditLogApi`    | 平台管理员             |
| 文件管理     | `system/file`         | `fileApi`        | 平台管理员             |
| 文件分组     | `system/file-group`   | `fileGroupApi`   | 平台管理员             |
| 应用管理     | `system/app`          | `appApi`         | 平台管理员             |

## 页面模式

- 列表页使用 `CrudPageLayout`、`DataTable` 或 `TreeTable`。
- 普通 CRUD 页面通过 `useCrudPage` 统一处理分页、详情、删除、批量删除和刷新。
- 树形页面通过 `useTreeCrudPage` 加载嵌套 `children` 数据。
- 租户应用订阅是租户管理页面内的弹窗能力，调用 `tenantApi.getApps/subscribeApp/unsubscribeApp`。
