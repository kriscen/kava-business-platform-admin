## ADDED Requirements

### Requirement: TreeSelect renders hierarchical options in a popover

TreeSelect 组件 SHALL 在 Popover 中渲染树形数据，支持单选。接收 `data`（树形数组）、`value`（当前选中 id）、`onChange`（选择回调）等 props。

#### Scenario: Open tree and select a node

- **WHEN** 用户点击 TreeSelect 触发器
- **THEN** 弹出 Popover 展示树形结构，用户点击节点后关闭 Popover 并触发 onChange

#### Scenario: Display selected value

- **WHEN** TreeSelect 已有 value 且 data 已加载
- **THEN** 触发器显示对应节点的 label 文本

#### Scenario: Empty state

- **WHEN** TreeSelect data 为空数组
- **THEN** Popover 中显示"暂无数据"提示

### Requirement: TreeSelect supports configurable field names

TreeSelect SHALL 通过 `labelField`（默认 'name'）、`valueField`（默认 'id'）、`childrenField`（默认 'children'）props 支持不同数据结构。

#### Scenario: Custom field names

- **WHEN** 传入 `labelField="label"` 的配置
- **THEN** 节点显示使用 data 中的 label 字段

### Requirement: TreeSelect indicates nesting with indentation

TreeSelect SHALL 使用缩进展示层级关系，每级增加固定 padding。

#### Scenario: Two-level tree rendering

- **WHEN** 数据包含父子两层
- **THEN** 子节点比父节点多一级缩进（如 padding-left 增加）
