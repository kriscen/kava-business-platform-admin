## MODIFIED Requirements

### Requirement: CRUD 管理页 i18n 支持

所有管理页面的用户可见字符串 SHALL 通过 i18n `t()` 函数引用对应模块的翻译 key。

#### Scenario: 各模块页面 i18n

- **WHEN** 各模块页面渲染时
- **THEN** 表头、按钮文字、搜索标签、提示消息均通过 `t('<module>.xxx')` 引用，翻译文件放在 `src/i18n/locales/zh-CN/<module>.json`
- **THEN** 新增的日志、审计日志、文件、文件分组、应用管理 5 个模块均遵循此规范
