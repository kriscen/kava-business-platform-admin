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
  /** 业务是否成功 */
  success: boolean
  /** 响应数据，失败时为 null */
  data: T | null
  /** 错误码，成功时为 null */
  errorCode: string | null
  /** 错误描述，成功时为 null */
  errorMessage: string | null
}
