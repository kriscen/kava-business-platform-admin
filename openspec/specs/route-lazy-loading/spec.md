## ADDED Requirements

### Requirement: 路由级代码分割

所有页面组件 SHALL 使用 `React.lazy()` 动态导入，实现路由级代码分割。

#### Scenario: 页面组件懒加载

- **WHEN** 应用构建
- **THEN** 每个页面组件生成独立的 chunk 文件（如 `Dashboard-[hash].js`）

#### Scenario: 首屏不加载非当前页面代码

- **WHEN** 用户访问登录页
- **THEN** 仅加载 LoginPage chunk，不加载 Dashboard、UserManagement 等页面的代码

### Requirement: Suspense loading fallback

路由切换时 SHALL 显示 Suspense fallback，避免页面空白。

#### Scenario: 加载中显示 fallback

- **WHEN** 用户导航到尚未加载的页面路由
- **THEN** 在内容区域显示居中的 loading spinner

#### Scenario: 加载完成后显示页面

- **WHEN** 页面 chunk 加载完成
- **THEN** loading fallback 消失，渲染目标页面内容
