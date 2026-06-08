import type { PageQuery } from './common'

/** 日志查询参数 */
export interface SysLogQuery extends PageQuery {
  title?: string
  logType?: string
  createBy?: string
}

/** 日志列表响应 */
export interface SysLogListResponse {
  id: number
  logType: string
  title: string
  requestUri: string
  method: string
  serviceId: string
  createBy: string
  gmtCreate: string
}

/** 日志详情响应 */
export interface SysLogDetailResponse extends SysLogListResponse {
  remoteAddr: string
  params: string
  time: number
  exception: string
}
