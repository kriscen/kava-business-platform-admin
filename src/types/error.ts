/**
 * 错误相关类型定义
 */

/**
 * 错误类型枚举
 */
export type ErrorType =
  | 'javascript' // JavaScript 运行时错误
  | 'promise' // 未捕获的 Promise rejection
  | 'render' // React 渲染错误
  | 'network' // 网络请求错误
  | 'business' // 业务逻辑错误

/**
 * 全局错误捕获的结构化信息
 */
export interface ErrorInfo {
  /** 错误类型 */
  type: ErrorType
  /** 错误消息 */
  message: string
  /** 错误堆栈 */
  stack?: string
  /** 发生时间戳 */
  timestamp: number
  /** React 组件堆栈（ErrorBoundary） */
  componentStack?: string
}