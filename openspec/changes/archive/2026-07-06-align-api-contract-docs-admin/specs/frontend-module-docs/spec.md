## ADDED Requirements

### Requirement: 前端模块文档按消费边界组织

前端 `docs/05-modules` SHALL 按前端子项目的维护边界组织文档，包括应用壳、认证入口、系统管理页面、API client、通用 hooks、mock、i18n 和组件，而不是按后端 Maven 模块组织。

#### Scenario: 系统管理页面文档

- **WHEN** 前端开发者阅读模块文档
- **THEN** SHALL 能找到已实现系统管理页面清单
- **AND** SHALL 能看到每类页面使用的 API module、hook、表格、表单和特殊交互入口

#### Scenario: API client 文档

- **WHEN** 前端开发者维护 `src/api/modules`
- **THEN** SHALL 能在前端文档中看到 API 响应包装、分页映射、错误处理和 mock 对齐规则

#### Scenario: 会员模块占位

- **WHEN** 前端尚未实现会员页面
- **THEN** 会员文档 SHALL 明确标注前端当前无页面实现
- **AND** SHALL NOT 暗示已存在会员管理 UI
