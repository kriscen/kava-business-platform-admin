/**
 * API 相关类型定义
 */

/**
 * HTTP 请求的全局配置
 */
export interface RequestConfig {
  /** API 基础地址 */
  baseURL?: string
  /** 请求超时时间（毫秒） */
  timeout?: number
  /** 默认请求头 */
  headers?: Record<string, string>
  /** 是否携带 Cookie */
  withCredentials?: boolean
}

/**
 * 后端 API 统一响应格式，对齐后端 JsonResult<T>
 */
export interface ApiResponse<T = unknown> {
  /** 业务状态码，"0" 表示成功 */
  code: string
  /** 响应数据 */
  data?: T
  /** 响应消息 */
  msg?: string
}
