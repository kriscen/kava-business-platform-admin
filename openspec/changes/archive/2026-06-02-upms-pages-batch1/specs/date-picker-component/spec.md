## ADDED Requirements

### Requirement: DatePicker renders datetime-local input

DatePicker 组件 SHALL 封装原生 `<input type="datetime-local">`，提供 `value`（ISO string）、`onChange`（回调）props，并添加统一的样式类。

#### Scenario: Select a date and time

- **WHEN** 用户点击 DatePicker 输入框，选择日期和时间
- **THEN** 触发 onChange 回调，传入 ISO 格式字符串

#### Scenario: Clear value

- **WHEN** 用户清空 DatePicker 输入
- **THEN** 触发 onChange 回调，传入 undefined 或空字符串

### Requirement: DatePicker supports placeholder and disabled state

DatePicker SHALL 支持 `placeholder` 和 `disabled` props。

#### Scenario: Disabled state

- **WHEN** DatePicker 传入 `disabled={true}`
- **THEN** 输入框不可交互，显示为灰色
