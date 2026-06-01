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

侧边栏响应式临界值为 768px，在布局组件中统一处理。

## 路由与懒加载

新增页面组件必须使用 `React.lazy()` 动态导入，在 `App.tsx` 中声明，不要使用静态 import。所有懒加载组件包裹在 `<Suspense fallback={<Spinner />}>` 中。

## i18n 规范

所有用户可见的字符串（按钮文字、标签、提示、错误消息、表头等）必须通过 i18n `t()` 函数引用翻译 key，不得直接硬编码在组件 JSX 或逻辑代码中。

- 翻译文件按功能模块拆分，放在 `src/i18n/locales/<locale>/` 目录下
- 当前仅维护 `zh-CN` locale
- 通用字符串放在 `common.json`，布局相关放在 `layout.json`，各业务模块独立文件（如 `user.json`、`login.json`）
- key 命名：`<模块>.<含义>` 格式，使用 camelCase（如 `user.username`、`common.confirm`）
- 引用方式：`t('common.confirm')`
