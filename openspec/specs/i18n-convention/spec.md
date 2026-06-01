## ADDED Requirements

### Requirement: 禁止组件内硬编码用户可见字符串

所有用户可见的字符串（按钮文字、标签、提示、错误消息、表头等）SHALL 通过 i18n `t()` 函数引用翻译 key，不得直接写在组件 JSX 或逻辑代码中。

#### Scenario: 新增页面使用 t() 引用文字

- **WHEN** 开发者创建新页面组件
- **THEN** 所有按钮文字、列标题、提示信息使用 `t('module.key')` 格式，而非硬编码中文字符串

#### Scenario: 表单标签使用 t() 引用

- **WHEN** 开发者创建表单字段
- **THEN** label 文字通过 `t()` 引用，placeholder 文字通过 `t()` 引用

#### Scenario: 错误提示使用 t() 引用

- **WHEN** 开发者编写错误提示消息
- **THEN** 消息文本通过 `t()` 引用翻译 key

### Requirement: 翻译文件按模块组织

翻译文件 SHALL 按功能模块拆分到独立 JSON 文件中，统一放在 `src/i18n/locales/<locale>/` 目录下。

#### Scenario: 新增模块翻译文件

- **WHEN** 开发者创建新的业务模块（如角色管理）
- **THEN** 在 `src/i18n/locales/zh-CN/` 下创建对应翻译文件（如 `role.json`）

#### Scenario: 翻译文件加载

- **WHEN** 应用启动
- **THEN** i18next 加载 `src/i18n/locales/zh-CN/` 目录下所有翻译文件

### Requirement: 翻译 key 命名规范

翻译 key SHALL 使用 `<模块>.<含义>` 格式，kebab-case 命名。

#### Scenario: key 命名格式

- **WHEN** 开发者为用户管理模块添加"用户名"翻译
- **THEN** key 为 `user.username`，value 为 `用户名`

#### Scenario: 通用翻译使用 common namespace

- **WHEN** 字符串为跨模块通用（如"确认"、"取消"、"保存"）
- **THEN** key 放在 `common.json` 中（如 `common.confirm`、`common.cancel`）
