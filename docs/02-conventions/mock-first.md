# Mock-first 前端开发规范

所有前端开发必须确保 `pnpm dev`（`VITE_ENABLE_MOCK=true`）模式下核心流程可跑通，不依赖后端服务。

## 背景与动机

项目使用 `vite-plugin-mock` 在 Vite dev server 层拦截 HTTP 请求，返回预设的 mock 数据。默认的 `pnpm dev` 命令启用 mock 模式（`VITE_ENABLE_MOCK=true`），前端开发者可以在不启动任何后端服务的情况下调试所有页面。

如果新增的 API 调用没有对应的 mock 端点，页面在 mock 模式下会出现网络错误、白屏或功能不可用。因此，**核心流程的 mock 必须与代码同步维护**。

## 必须添加 mock 的场景

| 场景                         | 要求                      |
| ---------------------------- | ------------------------- |
| 新增 API 端点，属于核心流程  | **必须**同步添加 mock     |
| 修改已有 API 的请求/响应结构 | **必须**同步更新对应 mock |
| 新增 API 端点，非核心流程    | 鼓励添加，不强制          |

## 什么是"核心流程"

核心流程是指如果缺少 mock 会导致以下问题的接口：

- 页面白屏或渲染异常
- 控制台出现网络错误（404 等）
- 基本操作无法完成（如列表加载、表单提交）

### 当前核心流程范围

| 类别              | 接口                   | Mock 文件        |
| ----------------- | ---------------------- | ---------------- |
| 认证              | 登录、登出、token 刷新 | `mock/auth.ts`   |
| 用户信息          | 当前用户信息           | `mock/user.ts`   |
| 导航              | 菜单加载               | `mock/menu.ts`   |
| 系统配置          | 系统配置读取           | `mock/system.ts` |
| 当前开发模块 CRUD | 模块的增删改查         | 按模块新增       |

随着项目演进，核心流程范围会扩大。判断标准不变：**缺少它，页面就不能正常使用。**

## Mock 文件规范

### 目录结构

所有 mock 文件放在项目根目录的 `mock/` 下：

```
mock/
├── index.ts      # 聚合注册所有 mock 模块
├── auth.ts       # 认证相关
├── user.ts       # 用户信息
├── system.ts     # 系统配置
├── menu.ts       # 菜单
└── ...           # 按业务模块新增
```

### 编写规范

1. **格式**：遵循 `vite-plugin-mock` 的 `MockMethod` 接口
2. **数据一致性**：mock 返回的数据结构应与 `src/api/modules/` 中的类型定义和 `docs/04-frontend/` 中的接口文档保持一致
3. **参考模式**：新增 mock 文件前，先阅读 `mock/auth.ts` 了解基本模式
4. **注册**：新建 mock 文件后，必须在 `mock/index.ts` 中导入并加入 `mocks` 数组

### 示例

```typescript
// mock/example.ts
import type { MockMethod } from 'vite-plugin-mock'

const exampleMocks: MockMethod[] = [
  {
    url: '/api/v1/example/list',
    method: 'get',
    response: ({ query }) => {
      return {
        success: true,
        data: {
          list: [],
          total: 0,
          pageNo: Number(query.pageNo) || 1,
          pageSize: Number(query.pageSize) || 10,
        },
        errorCode: null,
        errorMessage: null,
      }
    },
  },
]

export default exampleMocks
```

```typescript
// mock/index.ts — 注册新模块
import exampleMocks from './example'

const mocks: MockMethod[] = [
  ...authMocks,
  ...userMocks,
  ...systemMocks,
  ...menuMocks,
  ...exampleMocks, // 新增
]
```

## 验证方法

添加或修改 mock 后：

1. 运行 `pnpm dev`
2. 在浏览器中访问相关页面
3. 确认目标流程正常，不出现网络错误或白屏
4. 如果修改了认证相关 mock，测试登录/登出流程

## 已知缺口

以下 CRUD 接口暂无 mock，将在后续迭代中补充：

- `/api/v1/sys/user` — 用户管理
- `/api/v1/sys/role` — 角色管理
- `/api/v1/sys/tenant` — 租户管理
- `/api/v1/sys/group` — 分组管理
- `/api/v1/sys/menu` — 菜单管理
