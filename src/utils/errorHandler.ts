import type { ErrorInfo, ErrorType } from '@/types'

/**
 * 格式化错误信息
 */
export const formatError = (
  type: ErrorType,
  error: Error | PromiseRejectionEvent,
  componentStack?: string
): ErrorInfo => {
  const timestamp = Date.now()

  if (error instanceof Error) {
    return {
      type,
      message: error.message,
      stack: error.stack,
      timestamp,
      componentStack,
    }
  }

  // Promise rejection
  const rejectionError = error as PromiseRejectionEvent
  return {
    type,
    message: String(rejectionError.reason),
    timestamp,
  }
}

/**
 * 全局错误处理函数
 */
export const handleError = (errorInfo: ErrorInfo): void => {
  // 输出到控制台
  console.error('[Global Error]', {
    type: errorInfo.type,
    message: errorInfo.message,
    timestamp: new Date(errorInfo.timestamp).toISOString(),
    stack: errorInfo.stack,
    componentStack: errorInfo.componentStack,
  })

  // 预留监控服务接口
  // 可以在这里接入 Sentry、LogRocket 等监控服务
}

/**
 * 设置全局错误监听
 */
export const setupGlobalErrorHandlers = (): void => {
  // 捕获 JavaScript 运行时错误
  window.onerror = (message, _source, _lineno, _colno, error) => {
    const errorInfo: ErrorInfo = {
      type: 'javascript',
      message: String(message),
      stack: error?.stack,
      timestamp: Date.now(),
    }
    handleError(errorInfo)
    return false
  }

  // 捕获未处理的 Promise rejection
  window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    const errorInfo = formatError('promise', event)
    handleError(errorInfo)
  }
}