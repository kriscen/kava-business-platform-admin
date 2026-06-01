## ADDED Requirements

### Requirement: 404 Not Found 页面

系统 SHALL 提供 NotFound 页面，当用户访问不存在的路由时显示。

#### Scenario: 访问不存在的路径

- **WHEN** 用户访问 `/platform/unknown-path`
- **THEN** 显示 404 页面，包含错误码 "404"、提示信息和返回按钮

#### Scenario: 返回首页

- **WHEN** 用户在 404 页面点击返回按钮
- **THEN** 导航到当前角色的 Dashboard 页面

### Requirement: 通配路由匹配 NotFound

App.tsx 的通配路由 SHALL 渲染 NotFound 页面，而非静默重定向。

#### Scenario: 未匹配路径显示 404

- **WHEN** URL 不匹配任何已定义路由
- **THEN** 渲染 NotFound 组件

#### Scenario: 已认证用户看到返回首页

- **WHEN** 已认证用户访问不存在的路径
- **THEN** 404 页面显示"返回首页"按钮，点击后跳转到对应角色的 Dashboard
