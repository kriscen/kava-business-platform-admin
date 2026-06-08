# Audit Log Management Spec

### Requirement: 审计日志管理页面

系统 SHALL 展示审计日志分页列表，支持查看审计详情。审计日志为只读数据，不支持新增、编辑、删除。

#### Scenario: 审计日志列表加载

- **WHEN** 用户访问 `/platform/system/audit-log`
- **THEN** 系统调用 `GET /api/v1/sys/audit-log/page?pageNo=1&pageSize=10` 展示分页表格，列包含：审计名称 (auditName)、审计字段 (auditField)、变更前值 (beforeVal)、变更后值 (afterVal)、创建时间 (gmtCreate)、操作（查看详情）

#### Scenario: 审计日志按条件搜索

- **WHEN** 用户在搜索栏输入审计名称
- **THEN** 系统调用 `GET /api/v1/sys/audit-log/page?auditName={keyword}` 展示过滤结果

#### Scenario: 查看审计日志详情

- **WHEN** 用户点击某行的"查看详情"按钮
- **THEN** 系统调用 `GET /api/v1/sys/audit-log/{id}` 获取详情，在弹窗中展示完整审计信息

#### Scenario: 审计日志页面无新增按钮

- **WHEN** 用户访问审计日志管理页面
- **THEN** 页面不显示"新增"按钮，不显示批量删除功能，行操作不显示"编辑"和"删除"按钮
