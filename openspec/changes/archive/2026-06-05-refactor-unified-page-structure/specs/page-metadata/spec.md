# Page Metadata Spec — Delta

## MODIFIED Requirements

### Requirement: 路由元数据配置

系统 SHALL 提供集中的路由配置文件 `src/routes/config.ts`，包含所有已注册路由的标题 i18n key 和面包屑层级，包括之前缺失的 dept、tenant、public-param 条目。

#### Scenario: 配置文件包含所有路由元数据

- **WHEN** 应用启动
- **THEN** `routeConfig` 导出包含所有主要路由的配置对象，包括 `/platform/system/dept`、`/platform/system/tenant`、`/platform/system/public-param`，每个配置包含 `path`、`titleKey`、`breadcrumb` 属性

#### Scenario: 租户路由同样有元数据

- **WHEN** 租户管理员访问 `/tenant/system/users`
- **THEN** 面包屑正确显示"首页 / 系统管理 / 用户管理"
