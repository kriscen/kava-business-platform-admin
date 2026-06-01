## ADDED Requirements

### Requirement: ConfirmDialog 命令式调用

系统 SHALL 提供 `confirm()` 函数，支持在事件处理中以命令式方式弹出确认弹窗，返回 `Promise<boolean>`。

#### Scenario: 确认操作

- **WHEN** 调用 `confirm({ title: '删除确认', description: '确定要删除该用户吗？' })` 且用户点击确认按钮
- **THEN** Promise resolve 为 `true`

#### Scenario: 取消操作

- **WHEN** 调用 `confirm()` 且用户点击取消按钮或点击遮罩层
- **THEN** Promise resolve 为 `false`

### Requirement: ConfirmDialog 支持自定义内容

`confirm()` 函数 SHALL 接受 `title`、`description`、`confirmText`、`cancelText`、`variant` 参数。

#### Scenario: 危险操作样式

- **WHEN** 调用 `confirm({ variant: 'destructive', title: '删除确认' })`
- **THEN** 确认按钮显示红色危险样式

#### Scenario: 自定义按钮文案

- **WHEN** 调用 `confirm({ confirmText: '确定删除', cancelText: '再想想' })`
- **THEN** 确认按钮显示"确定删除"，取消按钮显示"再想想"

#### Scenario: 默认按钮文案

- **WHEN** 调用 `confirm({ title: '提示' })` 不传按钮文案
- **THEN** 确认按钮显示 i18n key `common.confirm`，取消按钮显示 `common.cancel`

### Requirement: ConfirmDialog 支持异步确认

确认按钮 SHALL 支持 `onConfirm` 回调，在异步操作期间禁用按钮并显示 loading。

#### Scenario: 异步确认 loading

- **WHEN** 传入 `onConfirm` 返回 Promise 且 Promise 未 resolve
- **THEN** 确认按钮显示 loading 状态，取消按钮和遮罩层点击无效

#### Scenario: 异步确认成功

- **WHEN** `onConfirm` Promise resolve
- **THEN** 弹窗关闭，`confirm()` Promise resolve 为 `true`

#### Scenario: 异步确认失败

- **WHEN** `onConfirm` Promise reject
- **THEN** 弹窗保持打开，错误通过 toast 提示
