## ADDED Requirements

### Requirement: 安装 shadcn UI 基础组件

项目 SHALL 通过 shadcn CLI 安装以下 UI 基础组件，确保与 base-nova 风格一致。

#### Scenario: 安装表格组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** src/components/ui/ 目录下生成 table.tsx，包含 Table、TableHeader、TableBody、TableRow、TableHead、TableCell 等组件

#### Scenario: 安装表单组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 input.tsx、label.tsx、select.tsx、checkbox.tsx、textarea.tsx、switch.tsx、form.tsx

#### Scenario: 安装弹窗组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 dialog.tsx，包含 Dialog、DialogContent、DialogHeader、DialogTitle、DialogDescription、DialogFooter 等组件

#### Scenario: 安装分页组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 pagination.tsx，包含 Pagination、PaginationContent、PaginationItem、PaginationLink 等组件

#### Scenario: 安装反馈组件

- **WHEN** 执行 shadcn CLI 安装命令
- **THEN** 生成 skeleton.tsx、card.tsx、badge.tsx、toast 相关组件

### Requirement: 安装表单和表格引擎依赖

项目 SHALL 安装 @tanstack/react-table、react-hook-form、@hookform/resolvers、zod 作为核心依赖。

#### Scenario: 安装表格引擎

- **WHEN** 执行 pnpm install
- **THEN** node_modules 中包含 @tanstack/react-table，package.json 中记录依赖

#### Scenario: 安装表单引擎

- **WHEN** 执行 pnpm install
- **THEN** node_modules 中包含 react-hook-form、@hookform/resolvers、zod

### Requirement: shadcn 组件与 base-nova 风格一致

所有安装的 shadcn 组件 SHALL 使用 @base-ui/react 原语，遵循 base-nova 风格规范。

#### Scenario: 组件使用 data-slot 属性

- **WHEN** 查看生成的组件代码
- **THEN** 组件使用 data-slot 属性进行样式标记

#### Scenario: 组件使用 cn() 工具函数

- **WHEN** 查看生成的组件代码
- **THEN** 组件从 @/lib/utils 导入 cn() 进行类名合并
