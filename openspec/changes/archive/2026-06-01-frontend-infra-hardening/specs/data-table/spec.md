## MODIFIED Requirements

### Requirement: DataTable 支持加载态和空态

DataTable 组件 SHALL 在数据加载时显示骨架屏，数据为空时显示空状态提示，请求失败时显示错误状态和重试按钮。

#### Scenario: 加载中

- **WHEN** fetchData 正在请求中
- **THEN** 表格区域显示 Skeleton 骨架屏

#### Scenario: 数据为空

- **WHEN** fetchData 返回空数组且 total 为 0
- **THEN** 表格显示空状态（使用 i18n key `common.noData`）

#### Scenario: 请求失败

- **WHEN** fetchData 抛出异常
- **THEN** 表格显示错误状态，包含错误图标、错误消息和"重试"按钮

#### Scenario: 重试加载

- **WHEN** 用户在错误状态下点击"重试"按钮
- **THEN** 重新调用 fetchData，显示 loading 骨架屏
