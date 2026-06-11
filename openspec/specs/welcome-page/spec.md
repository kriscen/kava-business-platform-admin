# Welcome Page Spec

## Purpose

Dashboard 欢迎页作为登录后的首页，根据用户角色展示个性化问候信息和快捷入口卡片网格，帮助用户快速导航到常用管理页面。

## Requirements

### Requirement: Dashboard 欢迎页问候区

Dashboard 页面 SHALL 在顶部展示用户问候信息，包含用户名和当前日期。

#### Scenario: 平台管理员看到平台问候

- **WHEN** platform_admin 角色用户访问 Dashboard 页面
- **THEN** 页面顶部显示"你好，{username}"和当前日期，副标题为平台管理员专属欢迎语

#### Scenario: 租户管理员看到租户问候

- **WHEN** tenant_admin 角色用户访问 Dashboard 页面
- **THEN** 页面顶部显示"你好，{username}"和当前日期，副标题为租户管理员专属欢迎语

### Requirement: Dashboard 角色感知快捷入口

Dashboard 页面 SHALL 根据当前用户角色展示不同的快捷入口卡片网格。

#### Scenario: 平台管理员快捷入口

- **WHEN** platform_admin 角色用户访问 Dashboard 页面
- **THEN** 页面展示快捷入口卡片网格，包含：用户管理、租户管理、应用管理、角色管理入口

#### Scenario: 租户管理员快捷入口

- **WHEN** tenant_admin 角色用户访问 Dashboard 页面
- **THEN** 页面展示快捷入口卡片网格，包含：角色管理、菜单管理、OAuth 客户端、个人设置入口

#### Scenario: 快捷入口卡片点击跳转

- **WHEN** 用户点击任意快捷入口卡片
- **THEN** 导航到对应的管理页面（使用 react-router-dom 的 navigate），路径包含正确的前缀（/platform/ 或 /tenant/）

### Requirement: 快捷入口卡片样式

每个快捷入口卡片 SHALL 包含图标、标题和描述文字，使用 Card 组件渲染。

#### Scenario: 卡片渲染内容

- **WHEN** 快捷入口卡片渲染
- **THEN** 卡片内包含 lucide-react 图标、标题文字和简短描述文字，使用统一的 Card 组件样式

#### Scenario: 卡片悬浮交互

- **WHEN** 用户鼠标悬浮在快捷入口卡片上
- **THEN** 卡片有视觉反馈（阴影或边框变化），表示可点击
