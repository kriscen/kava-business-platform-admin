# Docs Project Map

项目文档目录索引。

## 01-architecture/

| 文档                                           | 说明                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| [overview.md](01-architecture/overview.md)     | 架构概览：技术栈、项目结构、统一路由架构、路由懒加载、嵌套 ErrorBoundary |
| [boundaries.md](01-architecture/boundaries.md) | 模块边界：API 层、状态层、布局层（MainLayout）、错误处理、Token 刷新队列 |

## 02-conventions/

| 文档                                          | 说明                                                               |
| --------------------------------------------- | ------------------------------------------------------------------ |
| [code-style.md](02-conventions/code-style.md) | 代码风格：组件来源、Tailwind 规范、类型定义、i18n 规范、懒加载约定 |
| [git.md](02-conventions/git.md)               | Git 规范：Conventional Commits 格式                                |
| [mock-first.md](02-conventions/mock-first.md) | Mock-first 开发：核心流程必须可脱离后端调试                        |

## 03-reference/

| 文档                                          | 说明                                           |
| --------------------------------------------- | ---------------------------------------------- |
| [error-codes.md](03-reference/error-codes.md) | 错误码参考：错误分类、处理流程、组件级错误模式 |

## 04-frontend/

| 文档                                               | 说明                                              |
| -------------------------------------------------- | ------------------------------------------------- |
| [auth-api.md](04-frontend/auth-api.md)             | Auth 前端对接：OAuth2 登录流程、JWT Token 结构    |
| [auth-guide.md](04-frontend/auth-guide.md)         | 登录集成指南：对接 Kava 认证系统完整步骤          |
| [business-guide.md](04-frontend/business-guide.md) | 业务知识指南：平台业务模型对前端实现的影响        |
| [environment.md](04-frontend/environment.md)       | 环境与网络配置：前端项目接入基础设施信息          |
| [request-guide.md](04-frontend/request-guide.md)   | 请求与响应指南：API 响应格式、错误处理、分页结构  |
| [upms-api.md](04-frontend/upms-api.md)             | UPMS 前端对接：用户/角色/菜单/部门/租户 REST 接口 |

## 05-modules/

| 文档                                                            | 说明                               |
| --------------------------------------------------------------- | ---------------------------------- |
| [overview.md](05-modules/overview.md)                           | 模块索引：按模块组织的文档目录     |
| [core/README.md](05-modules/core/README.md)                     | 核心模块：API 层、认证、状态管理   |
| [core/components.md](05-modules/core/components.md)             | 公共组件：DataTable、TreeSelect 等 |
| [core/hooks-and-routes.md](05-modules/core/hooks-and-routes.md) | 路由与 Hooks：统一路由与角色守卫   |
| [core/user-management.md](05-modules/core/user-management.md)   | 用户管理：关联选择器、类型定义     |
| [member/README.md](05-modules/member/README.md)                 | 会员模块：待补充                   |

## 06-product/

| 文档                                | 说明                               |
| ----------------------------------- | ---------------------------------- |
| [README.md](06-product/README.md)   | 产品设想与规划文档索引             |
| [roadmap.md](06-product/roadmap.md) | 路线图：分阶段交付计划             |
| [vision.md](06-product/vision.md)   | 产品愿景：定位、核心理念、功能板块 |
