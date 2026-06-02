## MODIFIED Requirements

### Requirement: i18n translation files per module

系统 SHALL 为每个业务模块维护独立的翻译文件。新增 `dept.json`、`tenant.json`、`publicParam.json` 到 `src/i18n/locales/zh-CN/` 目录。

#### Scenario: Dept translation keys

- **WHEN** 部门页面渲染
- **THEN** 所有字符串通过 `t('dept.xxx')` 引用，翻译定义在 `dept.json` 中

#### Scenario: Tenant translation keys

- **WHEN** 租户页面渲染
- **THEN** 所有字符串通过 `t('tenant.xxx')` 引用，翻译定义在 `tenant.json` 中

#### Scenario: PublicParam translation keys

- **WHEN** 公共参数页面渲染
- **THEN** 所有字符串通过 `t('publicParam.xxx')` 引用，翻译定义在 `publicParam.json` 中
