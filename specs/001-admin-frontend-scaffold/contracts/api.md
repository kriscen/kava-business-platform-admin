# API 契约：后台管理前端项目基础架构

**功能分支**：`001-admin-frontend-scaffold`
**日期**：2026-03-16
**版本**：1.0.0

## 概述

本文档定义后台管理系统与后端 API 的接口契约。

**基础信息**：
- 基础 URL：`/api`（可通过环境变量 `VITE_API_BASE_URL` 配置）
- 协议：HTTP/HTTPS
- 数据格式：JSON
- 编码：UTF-8

---

## 通用规范

### 请求头

| Header | 必填 | 说明 |
|--------|------|------|
| Content-Type | 是 | `application/json` |
| Authorization | 否 | `Bearer <token>`（登录后携带） |
| Accept-Language | 否 | 语言标识，如 `zh-CN` |

### 响应格式

所有接口返回统一的响应结构：

```typescript
interface ApiResponse<T> {
  code: number;        // 业务状态码
  data?: T;           // 响应数据
  message?: string;   // 响应消息
}
```

### 状态码定义

| Code | 说明 |
|------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未授权 |
| 1003 | 禁止访问 |
| 2001 | 资源不存在 |
| 5001 | 服务器内部错误 |

### HTTP 状态码

| Status | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |

---

## 接口定义

### 1. 用户相关（预留）

#### 1.1 获取当前用户信息

**GET** `/api/user/info`

**说明**：获取当前登录用户的基本信息（预留接口，供后续认证模块使用）

**请求示例**：
```http
GET /api/user/info HTTP/1.1
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://example.com/avatar.png",
    "roles": ["admin"]
  },
  "message": "success"
}
```

**响应类型**：
```typescript
interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  roles: string[];
}
```

---

### 2. 系统配置（预留）

#### 2.1 获取系统配置

**GET** `/api/system/config`

**说明**：获取系统全局配置（预留接口）

**请求示例**：
```http
GET /api/system/config HTTP/1.1
```

**响应示例**：
```json
{
  "code": 0,
  "data": {
    "siteName": "Kava Admin",
    "logo": "/logo.png",
    "version": "1.0.0"
  },
  "message": "success"
}
```

**响应类型**：
```typescript
interface SystemConfig {
  siteName: string;
  logo: string;
  version: string;
}
```

---

### 3. 菜单相关（预留）

#### 3.1 获取用户菜单

**GET** `/api/menu/user`

**说明**：获取当前用户可访问的菜单列表（预留接口）

**请求示例**：
```http
GET /api/menu/user HTTP/1.1
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "code": 0,
  "data": [
    {
      "key": "dashboard",
      "label": "仪表盘",
      "icon": "DashboardOutlined",
      "path": "/dashboard",
      "sort": 1
    },
    {
      "key": "system",
      "label": "系统管理",
      "icon": "SettingOutlined",
      "sort": 2,
      "children": [
        {
          "key": "users",
          "label": "用户管理",
          "path": "/system/users",
          "sort": 1
        }
      ]
    }
  ],
  "message": "success"
}
```

**响应类型**：
```typescript
interface MenuResponse {
  code: number;
  data: MenuItem[];
  message?: string;
}
```

---

## 错误处理

### 错误响应格式

```json
{
  "code": 1001,
  "message": "参数错误：用户名不能为空",
  "data": null
}
```

### 错误处理策略

| 场景 | HTTP Status | 处理方式 |
|------|-------------|---------|
| 网络错误 | - | 提示"网络连接失败" |
| 请求超时 | - | 提示"请求超时" |
| 401 未授权 | 401 | 跳转登录页（预留钩子） |
| 403 禁止访问 | 403 | 提示"无权限访问" |
| 404 不存在 | 404 | 提示"资源不存在" |
| 500 服务器错误 | 500 | 提示"服务器错误" |
| 业务错误 | 200 | 根据业务码提示错误信息 |

---

## Mock 数据示例

### Mock 配置

```typescript
// mock/user.ts
export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        roles: ['admin']
      },
      message: 'success'
    })
  }
]
```

---

## 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| 1.0.0 | 2026-03-16 | 初始版本，定义预留接口 |