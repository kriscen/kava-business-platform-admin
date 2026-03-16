# 快速开始指南

**项目**：kava-business-platform-admin
**功能分支**：`001-admin-frontend-scaffold`
**日期**：2026-03-16

## 环境要求

- **Node.js**：18.x 或更高版本
- **包管理器**：npm 9.x 或 pnpm 8.x
- **编辑器**：VS Code（推荐）

## 快速启动

```bash
# 1. 克隆项目
git clone <repository-url>
cd kava-business-platform-admin

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问
# 默认地址：http://localhost:3000
```

## 可用脚本

| 脚本 | 命令 | 说明 |
|------|------|------|
| 开发 | `npm run dev` | 启动开发服务器（热更新） |
| 构建 | `npm run build` | 生产环境构建 |
| 预览 | `npm run preview` | 预览构建结果 |
| 代码检查 | `npm run lint` | 运行 ESLint 检查 |
| 代码格式化 | `npm run format` | 运行 Prettier 格式化 |
| 类型检查 | `npm run type-check` | 运行 TypeScript 类型检查 |
| 测试 | `npm run test` | 运行测试 |
| 测试（覆盖率） | `npm run test:coverage` | 运行测试并生成覆盖率报告 |

## 项目结构

```
kava-business-platform-admin/
├── src/
│   ├── api/              # HTTP 请求封装
│   ├── components/       # 公共组件
│   │   ├── layout/       # 布局组件
│   │   └── ErrorBoundary/# 错误边界
│   ├── stores/           # 状态管理
│   ├── i18n/             # 国际化
│   ├── mock/             # Mock 数据
│   ├── hooks/            # 自定义 Hooks
│   ├── utils/            # 工具函数
│   ├── types/            # 类型定义
│   ├── styles/           # 全局样式
│   ├── App.tsx           # 根组件
│   └── main.tsx          # 应用入口
├── public/               # 静态资源
├── tests/                # 测试文件
└── specs/                # 功能规范文档
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 构建工具 | Vite 5.x |
| 前端框架 | React 18.x |
| 语言 | TypeScript 5.x |
| UI 库 | Ant Design 5.x |
| 路由 | react-router-dom 6.x |
| HTTP 客户端 | Axios 1.x |
| 状态管理 | Zustand 4.x |
| 国际化 | react-i18next 14.x |
| 测试 | Vitest + React Testing Library |

## 开发指南

### 路径别名

项目配置了 `@/` 别名指向 `src/` 目录：

```typescript
// 使用示例
import { request } from '@/api/request'
import { useAppStore } from '@/stores/appStore'
```

### 环境变量

创建 `.env.local` 文件配置本地环境变量：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080/api

# 是否启用 Mock
VITE_ENABLE_MOCK=true
```

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 提交代码前请确保通过 `npm run lint` 检查

### Git 提交规范

遵循 Conventional Commits 规范：

```
<type>(<scope>): <subject>

type: feat|fix|docs|style|refactor|test|chore
scope: 可选，影响范围
subject: 简短描述
```

示例：
- `feat(layout): add sidebar collapse animation`
- `fix(api): handle network timeout error`

## 常见问题

### Q: 开发服务器启动失败？

检查 Node.js 版本是否 >= 18：
```bash
node -v
```

### Q: 热更新不生效？

1. 检查文件是否在 `src/` 目录下
2. 尝试重启开发服务器

### Q: Mock 数据不生效？

确认 `.env.local` 中设置了：
```bash
VITE_ENABLE_MOCK=true
```

## 下一步

1. 阅读 [spec.md](./spec.md) 了解功能需求
2. 阅读 [plan.md](./plan.md) 了解实现方案
3. 阅读 [data-model.md](./data-model.md) 了解数据结构
4. 阅读 [contracts/api.md](./contracts/api.md) 了解 API 契约