## ADDED Requirements

### Requirement: View tenant subscribed apps

租户管理页面 SHALL 提供"应用订阅"操作入口，点击后展示该租户已订阅的应用列表。

#### Scenario: Open subscription dialog

- **WHEN** 用户在租户列表某行点击"应用订阅"按钮
- **THEN** 系统调用 `GET /api/v1/sys/tenant/{tenantId}/apps` 获取已订阅应用列表，并在弹窗中展示

#### Scenario: Display subscribed app list

- **WHEN** 弹窗打开且接口返回成功
- **THEN** 列表展示每个已订阅应用的名称、编码、图标、状态，每行提供"退订"操作按钮

#### Scenario: Empty subscription list

- **WHEN** 该租户尚未订阅任何应用
- **THEN** 弹窗展示空状态提示

### Requirement: Subscribe app to tenant

用户 SHALL 能够为指定租户订阅新的应用。

#### Scenario: Select and subscribe app

- **WHEN** 用户在弹窗的"订阅新应用"区域选择一个应用并点击"订阅"按钮
- **THEN** 系统调用 `POST /api/v1/sys/tenant/{tenantId}/apps` 并传入 `{ appId }`，成功后刷新已订阅列表

#### Scenario: Subscribe already subscribed app

- **WHEN** 用户尝试订阅租户已拥有的应用
- **THEN** 系统返回错误提示（错误码 `10100001`），前端展示"已订阅"提示

#### Scenario: Subscribe system app

- **WHEN** 用户订阅系统内置应用（如 kava-base）
- **THEN** 订阅成功，系统应用与普通应用流程一致

### Requirement: Unsubscribe app from tenant

用户 SHALL 能够退订租户已订阅的应用。

#### Scenario: Unsubscribe normal app

- **WHEN** 用户点击某已订阅应用的"退订"按钮并确认
- **THEN** 系统调用 `DELETE /api/v1/sys/tenant/{tenantId}/apps/{appId}`，成功后刷新已订阅列表

#### Scenario: Unsubscribe system app

- **WHEN** 用户尝试退订系统内置应用（kava-base）
- **THEN** 系统返回错误提示（错误码 `10100002`），前端展示"系统应用不可退订"提示

#### Scenario: Confirm before unsubscribe

- **WHEN** 用户点击"退订"按钮
- **THEN** 系统弹出确认对话框，用户确认后才执行退订操作

### Requirement: Mock data for tenant app subscription

mock 系统 SHALL 提供租户应用订阅的全部 3 个端点的 mock 数据。

#### Scenario: Mock endpoints available in dev mode

- **WHEN** 开发模式下前端调用租户应用订阅接口
- **THEN** mock 系统返回预设的订阅数据，不依赖后端服务
