## ADDED Requirements

### Requirement: FormModal 支持弹窗开关

FormModal 组件 SHALL 通过 open 和 onOpenChange 控制弹窗的显示和隐藏。

#### Scenario: 打开弹窗

- **WHEN** open 属性设为 true
- **THEN** 弹窗显示，包含标题、表单内容区、取消/确认按钮

#### Scenario: 关闭弹窗

- **WHEN** 用户点击取消按钮或点击遮罩层
- **THEN** 调用 onOpenChange(false)，弹窗关闭

### Requirement: FormModal 支持新建/编辑标题切换

FormModal 组件 SHALL 根据 mode 属性自动切换标题，新建时显示"新增 XXX"，编辑时显示"编辑 XXX"。

#### Scenario: 新建模式

- **WHEN** mode="create" title="用户"
- **THEN** 弹窗标题显示"新增用户"

#### Scenario: 编辑模式

- **WHEN** mode="edit" title="用户"
- **THEN** 弹窗标题显示"编辑用户"

### Requirement: FormModal 支持表单提交和 loading

FormModal 组件 SHALL 在用户点击确认时触发 onSubmit 回调，并在提交期间显示 loading 状态。

#### Scenario: 提交表单

- **WHEN** 用户点击确认按钮
- **THEN** 调用 onSubmit() 回调

#### Scenario: 提交中 loading

- **WHEN** onSubmit 回调正在执行（返回 Promise）
- **THEN** 确认按钮显示 loading 状态，不可重复点击

#### Scenario: 提交完成后关闭

- **WHEN** onSubmit 成功完成（Promise resolve）
- **THEN** 弹窗自动关闭

### Requirement: FormModal 支持表单重置

FormModal 组件 SHALL 在弹窗关闭时重置表单状态，确保下次打开时表单为空或为初始值。

#### Scenario: 关闭后重置

- **WHEN** 弹窗关闭（open 从 true 变为 false）
- **THEN** 表单字段重置为默认值

#### Scenario: 编辑时填充初始值

- **WHEN** mode="edit" 且传入 initialValues
- **THEN** 表单字段显示初始值

### Requirement: FormModal 支持 children 表单内容

FormModal 组件 SHALL 通过 children 接受任意表单内容，不关心具体字段。

#### Scenario: 自定义表单内容

- **WHEN** 传入 children={<UserForm />}
- **THEN** 弹窗内容区渲染 UserForm 组件
