# Kava Business Platform Admin

企业级后台管理平台前端项目。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **UI 组件库**: shadcn/ui (base-ui/react)
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **国际化**: i18next
- **路由**: React Router DOM 7
- **开发工具**: Claude Code + Speckit + Trae (GLM-5)

## 环境要求

- Node.js >= 18
- pnpm >= 8

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发（使用 Mock 数据）
pnpm dev

# 连接 Staging 服务器
pnpm dev:staging

# 模拟生产环境
pnpm dev:prod
```

## 登录信息

开发环境（Mock 模式）登录地址和账号：

| 角色       | 登录地址                               | 账号     | 密码     | 租户编码 |
| ---------- | -------------------------------------- | -------- | -------- | -------- |
| 平台管理员 | `http://localhost:3000/platform/login` | `admin`  | `123456` | —        |
| 租户管理员 | `http://localhost:3000/tenant/login`   | `tenant` | `123456` | `DEMO`   |

> Mock 模式下登录页面底部会显示测试账号提示信息。

## 可用脚本

| 脚本                 | 说明                                    |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | 本地开发（development 模式，Mock 数据） |
| `pnpm dev:staging`   | 连接 Staging 服务器开发                 |
| `pnpm dev:prod`      | 模拟生产环境开发                        |
| `pnpm build`         | 构建生产版本                            |
| `pnpm build:staging` | 构建 Staging 版本                       |
| `pnpm preview`       | 预览构建结果                            |
| `pnpm lint`          | 代码检查                                |
| `pnpm lint:fix`      | 自动修复代码问题                        |
| `pnpm format`        | 格式化代码                              |
| `pnpm type-check`    | TypeScript 类型检查                     |

## 环境配置

项目支持三环境划分：

| 环境        | 文件               | 说明                     |
| ----------- | ------------------ | ------------------------ |
| development | `.env.development` | 本地开发，使用 Mock 数据 |
| staging     | `.env.staging`     | 开发服务器环境           |
| production  | `.env.production`  | 生产环境                 |

## 项目结构

```
.
├── .claude/           # Claude Code 配置
├── .specify/          # Speckit 配置
├── mock/              # Mock 数据
├── public/            # 静态资源
├── src/
│   ├── assets/        # 资源文件
│   ├── components/    # 公共组件
│   ├── hooks/         # 自定义 Hooks
│   ├── layouts/       # 布局组件
│   ├── locales/       # 国际化文件
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── services/      # API 服务
│   ├── stores/        # 状态管理
│   ├── styles/        # 全局样式
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   ├── App.tsx        # 根组件
│   └── main.tsx       # 入口文件
├── specs/             # 功能规范文档
└── vite.config.ts     # Vite 配置
```

## 开发规范

项目使用 Speckit 工作流进行规范驱动开发：

1. `/speckit.specify` - 创建功能规范
2. `/speckit.clarify` - 澄清需求
3. `/speckit.plan` - 生成技术方案
4. `/speckit.tasks` - 生成任务列表
5. `/speckit.implement` - 执行实现

## License

MIT
