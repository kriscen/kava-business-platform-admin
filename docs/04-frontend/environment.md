# 环境与网络配置

> 本文档提供前端项目接入 Kava 平台所需的基础设施信息。

## 服务端口

| 服务    | 端口   | 上下文路径 | 说明                   |
| ------- | ------ | ---------- | ---------------------- |
| Gateway | `8500` | —          | API 网关，前端统一入口 |
| Auth    | `8600` | `/auth`    | OAuth2 认证授权中心    |
| UPMS    | `8610` | `/upms`    | 用户权限管理服务       |
| Member  | `8620` | `/member`  | 会员服务               |

## 路由规则

Gateway 按路径前缀路由到下游服务：

| 路径前缀     | 目标服务    | 完整地址示例                                      |
| ------------ | ----------- | ------------------------------------------------- |
| `/auth/**`   | kbpd-auth   | `http://localhost:8500/auth/oauth2/token`         |
| `/upms/**`   | kbpd-upms   | `http://localhost:8500/upms/api/v1/sys/user/page` |
| `/member/**` | kbpd-member | `http://localhost:8500/member/...`                |

> Gateway 做纯路由透传，不校验 JWT、不修改请求。所有鉴权由下游服务自行完成。

## 前端接入地址

**开发环境**：

| 用途                | 地址                         |
| ------------------- | ---------------------------- |
| 业务接口（推荐）    | `http://localhost:8500/upms` |
| 认证接口            | `http://localhost:8500/auth` |
| UPMS 直连（调试用） | `http://localhost:8610`      |

> 生产环境地址请咨询后端部署配置，前端应通过环境变量管理基地址。

## CORS

- **开发环境**：所有接口已开放 CORS，允许任意 Origin（`*`）
- **生产环境**：需要后端配置具体的允许域名，请提前与后端沟通

## 必须携带的 Header

| Header          | 值                      | 何时需要                                |
| --------------- | ----------------------- | --------------------------------------- |
| `Authorization` | `Bearer <access_token>` | 所有业务接口（登录和 Token 端点不需要） |
| `Content-Type`  | `application/json`      | POST/PUT 请求体为 JSON 时               |

> **tenantId 不需要前端传递**。后端从 JWT Token 中自动解析租户上下文。

## ID 字段精度说明

所有 `Long` 类型的 ID 字段（如 `id`、`userId`、`roleId`、`tenantId` 等）在 JSON 响应中序列化为 **字符串**，避免 JavaScript 处理大整数时丢失精度。

```json
{
  "id": "1234567890123456789",
  "name": "admin"
}
```

前端解析时注意：这些字段虽然是数字型 ID，但以字符串传输。
