# 代码风格

## 组件来源

优先使用 shadcn/ui 组件，路径：`src/components/ui/`

添加新组件前先检查是否已存在。

## 导入顺序

1. React / 内置
2. 第三方库
3. `@/` 别名导入 (项目内部)
4. `../` 相对导入

## API 响应类型

所有 API 返回 `ApiResponse<T>` 格式：

```typescript
interface ApiResponse<T = unknown> {
  code: number // 0 = 成功
  data?: T
  message?: string
}
```

## 状态管理约定

Zustand store 必须包含：

- State 类型定义
- Actions 类型定义
- Store 类型 (State & Actions)
- initialState 初始状态

使用 devtools middleware 便于调试，命名空间为 Store 名称。

## 响应式约定

侧边栏响应式临界值为 768px，在 AdminLayout 中统一处理。
