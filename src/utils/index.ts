/**
 * 工具函数导出
 */

export { formatError, handleError, setupGlobalErrorHandlers } from './errorHandler'

/**
 * 通用工具函数
 */

/**
 * 延迟函数
 */
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 判断是否为空值
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 生成唯一 ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}