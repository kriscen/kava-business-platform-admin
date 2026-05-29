## 1. 安装依赖和 UI 组件

- [x] 1.1 安装 @tanstack/react-table、react-hook-form、@hookform/resolvers、zod 依赖
- [x] 1.2 用 shadcn CLI 安装 table、input、label、select、checkbox、textarea、switch 组件
- [x] 1.3 用 shadcn CLI 安装 dialog、form、skeleton、card、badge、pagination、toast 组件

## 2. 封装 DataTable 通用组件

- [x] 2.1 创建 src/components/data-table.tsx，实现 DataTable 组件基础结构（props: columns, fetchData, searchSlot, toolbarSlot）
- [x] 2.2 实现服务端分页逻辑（pageNo、pageSize、total 状态管理，自动调用 fetchData）
- [x] 2.3 实现列定义渲染（支持 key、title、render 自定义渲染）
- [x] 2.4 实现加载态（Skeleton 骨架屏）和空态（暂无数据提示）
- [x] 2.5 实现搜索栏和工具栏插槽渲染
- [x] 2.6 实现行选择功能（复选框、全选、onSelectedRowsChange 回调）

## 3. 封装 FormModal 通用组件

- [x] 3.1 创建 src/components/form-modal.tsx，实现 FormModal 组件基础结构（props: open, onOpenChange, mode, title, onSubmit, children）
- [x] 3.2 实现弹窗开关逻辑（open/onOpenChange 控制）
- [x] 3.3 实现新建/编辑标题切换（mode="create" 显示"新增 XXX"，mode="edit" 显示"编辑 XXX"）
- [x] 3.4 实现表单提交和 loading 状态（onSubmit 回调，按钮 loading，自动关闭）
- [x] 3.5 实现表单重置（关闭时重置，编辑时填充 initialValues）

## 4. 验证页面

- [x] 4.1 改造 src/pages/platform/UserManagement.tsx，使用 DataTable 展示用户列表（调用 userApi.getPage）
- [x] 4.2 实现用户搜索栏（用户名、手机号、状态筛选）
- [x] 4.3 实现用户新增/编辑表单（使用 FormModal + react-hook-form + zod）
- [x] 4.4 实现用户删除功能（单个删除和批量删除）
- [x] 4.5 验证分页、搜索、新增、编辑、删除功能正常工作
