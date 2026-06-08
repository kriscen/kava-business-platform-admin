import type { PageQuery } from './common'

/** 审计日志查询参数 */
export interface SysAuditLogQuery extends PageQuery {
  auditName?: string
}

/** 审计日志列表响应 */
export interface SysAuditLogListResponse {
  id: number
  auditName: string
  auditField: string
  beforeVal: string
  afterVal: string
  gmtCreate: string
}

/** 审计日志详情响应 */
export interface SysAuditLogDetailResponse extends SysAuditLogListResponse {
  createBy: string
  requestUri: string
  method: string
}
