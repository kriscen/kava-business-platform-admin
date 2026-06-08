import type { PageQuery } from './common'

/** i18n 查询参数 */
export interface SysI18nQuery extends PageQuery {
  code?: string
  language?: string
}

/** i18n 创建/更新请求 */
export interface SysI18nRequest {
  id?: number
  code: string
  language: string
  content: string
}

/** i18n 列表响应 */
export interface SysI18nListResponse {
  id: number
  code: string
  language: string
  content: string
  gmtCreate: string
  gmtModified: string
}

/** i18n 详情响应 */
export interface SysI18nDetailResponse {
  id: number
  code: string
  language: string
  content: string
  gmtCreate: string
  gmtModified: string
}
