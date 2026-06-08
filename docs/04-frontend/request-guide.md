# 请求与响应指南

> 本文档说明 Kava API 的响应格式、错误处理、分页结构和前端请求配置建议。

---

## 响应格式

### 统一响应包装 JsonResult

所有接口返回 `JsonResult<T>`，字段如下：

```json
{
  "success": true,
  "data": { ... },
  "errorCode": null,
  "errorMessage": null
}
```

| 字段           | 类型    | 说明                                       |
| -------------- | ------- | ------------------------------------------ |
| `success`      | boolean | `true` = 成功，`false` = 失败              |
| `data`         | T       | 业务数据，失败时为 `null`                  |
| `errorCode`    | String  | 错误码，成功时为 `null`，通用错误为 `"-1"` |
| `errorMessage` | String  | 错误描述，成功时为 `null`                  |

### 成功响应示例

**单个对象**：

```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "admin",
    "phone": "13800138000"
  },
  "errorCode": null,
  "errorMessage": null
}
```

**空操作成功**（如删除、更新）：

```json
{
  "success": true,
  "data": null,
  "errorCode": null,
  "errorMessage": null
}
```

### 失败响应示例

**业务错误**：

```json
{
  "success": false,
  "data": null,
  "errorCode": "10020002",
  "errorMessage": "用户名已存在"
}
```

**通用错误**：

```json
{
  "success": false,
  "data": null,
  "errorCode": "-1",
  "errorMessage": "系统异常，请稍后重试"
}
```

---

## 分页响应

分页接口返回 `JsonResult<PagingInfo<T>>`：

```json
{
  "success": true,
  "data": {
    "list": [
      { "id": "1", "username": "admin" },
      { "id": "2", "username": "user01" }
    ],
    "total": 100,
    "pageNo": 1,
    "pageSize": 10
  },
  "errorCode": null,
  "errorMessage": null
}
```

| 字段       | 类型   | 说明           |
| ---------- | ------ | -------------- |
| `list`     | T[]    | 当前页数据列表 |
| `total`    | number | 总记录数       |
| `pageNo`   | number | 当前页码       |
| `pageSize` | number | 每页条数       |

### 分页请求参数

| 参数       | 类型 | 默认值 | 说明     |
| ---------- | ---- | ------ | -------- |
| `pageNo`   | int  | 1      | 页码     |
| `pageSize` | int  | 10     | 每页条数 |

分页参数通过 URL query string 传递：

```
GET /api/v1/sys/user/page?pageNo=1&pageSize=10&username=admin
```

---

## 错误码体系

### 格式

错误码为 **8 位数字字符串**：`MM-SS-NNNN`

| 段   | 长度 | 含义            | 示例                  |
| ---- | ---- | --------------- | --------------------- |
| MM   | 2 位 | 模块编号        | `10` = UPMS           |
| SS   | 2 位 | 子模块/错误类别 | `02` = 用户           |
| NNNN | 4 位 | 具体错误序号    | `0002` = 用户名已存在 |

### 错误类别（通用错误码 MM=00）

| 前缀   | 类别           | 说明                     | 前端处理           |
| ------ | -------------- | ------------------------ | ------------------ |
| `0001` | 客户端请求错误 | 参数格式错误、缺少必填项 | 检查请求参数       |
| `0002` | 服务端错误     | 数据库异常、RPC 异常     | 提示系统异常       |
| `0003` | 认证/授权错误  | Token 无效、权限不足     | 跳登录或提示无权限 |

### 常见认证错误码

| 错误码     | 含义                               | 前端处理                     |
| ---------- | ---------------------------------- | ---------------------------- |
| `00030001` | 未认证（缺少 Token）               | 跳转登录页                   |
| `00030002` | Token 已过期                       | 尝试用 refresh_token 刷新    |
| `00030003` | Token 无效（格式错误、签名不匹配） | 跳转登录页                   |
| `00030004` | 权限不足                           | 提示"无权限访问"             |
| `00030005` | 租户无效或已冻结                   | 提示"账号异常，请联系管理员" |

> 完整错误码表见 `../04-reference/error-codes.md`。

---

## ID 精度处理

所有 `Long` 类型字段（ID 类字段）在 JSON 中序列化为**字符串**，避免 JavaScript `Number` 精度丢失。

```json
{
  "id": "1234567890123456789",
  "tenantId": "1000001",
  "roleIds": ["1", "2", "3"]
}
```

前端解析时注意：这些字段虽然是数字型 ID，但以字符串传输。比较时使用字符串比较（`===`），不要转为 `Number`。

---

## 前端请求配置建议（Axios 示例）

### 基础配置

```javascript
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8500',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 请求拦截器

```javascript
http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 响应拦截器

```javascript
http.interceptors.response.use(
  (response) => {
    const result = response.data

    // 业务层判断
    if (result.success) {
      return result.data
    }

    // 业务错误
    const code = result.errorCode
    const message = result.errorMessage

    // Token 过期 → 尝试刷新
    if (code === '00030002') {
      return handleTokenRefresh(response.config)
    }

    // 未认证 → 跳登录
    if (code === '00030001' || code === '00030003') {
      redirectToLogin()
      return Promise.reject(new Error(message))
    }

    // 权限不足
    if (code === '00030004') {
      // 可选：弹出无权限提示
      return Promise.reject(new Error(message))
    }

    // 其他业务错误
    return Promise.reject(new Error(message))
  },
  (error) => {
    // HTTP 层错误（网络异常、超时等）
    if (error.response?.status === 401) {
      redirectToLogin()
    }
    return Promise.reject(error)
  }
)
```

### Token 刷新机制

```javascript
let refreshPromise = null

async function handleTokenRefresh(failedConfig) {
  // 防止多个请求同时刷新
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }

  try {
    const newToken = await refreshPromise
    failedConfig.headers.Authorization = `Bearer ${newToken}`
    return http.request(failedConfig)
  } catch {
    redirectToLogin()
    return Promise.reject(new Error('登录已过期'))
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/oauth2/token`,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(clientId + ':' + clientSecret)}`,
      },
    }
  )

  const data = response.data.data || response.data
  setAccessToken(data.access_token)
  setRefreshToken(data.refresh_token)
  return data.access_token
}
```

---

## 接口风格速查

| 操作     | HTTP 方法 | 路径格式     | 参数位置               | 返回值                   |
| -------- | --------- | ------------ | ---------------------- | ------------------------ |
| 分页查询 | GET       | `/page`      | Query String           | `PagingInfo<T>`          |
| 详情     | GET       | `/{id}`      | Path                   | 对象                     |
| 下拉列表 | GET       | `/dropdown`  | 无                     | `List<T>`                |
| 树形结构 | GET       | `/tree`      | 无/Query               | `List<T>`（含 children） |
| 创建     | POST      | —            | JSON Body              | 新 ID (String)           |
| 更新     | PUT       | `/{id}` 或 — | JSON Body              | Void 或 Boolean          |
| 删除     | DELETE    | —            | JSON Body `List<Long>` | Void 或 Boolean          |

### 注意事项

- **User / Role 的 PUT** 不带 `/{id}` 路径参数，ID 在请求体中
- **其余资源的 PUT** 带 `/{id}` 路径参数
- **批量删除** 统一用 DELETE + 请求体 `List<Long>` IDs
- **所有下拉接口** 不分页，返回完整列表
- **树形接口** 返回嵌套 `children` 结构
