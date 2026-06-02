import type { PageQuery } from './common'

/** 公共参数查询参数 */
export interface SysPublicParamQuery extends PageQuery {
  publicName?: string
  publicKey?: string
  publicType?: string
  status?: string
}

/** 公共参数创建/更新请求 */
export interface SysPublicParamRequest {
  id?: number
  publicName: string
  publicKey: string
  publicValue: string
  status?: string
  publicType?: string
  systemFlag?: string
  remark?: string
}

/** 公共参数列表响应 */
export interface SysPublicParamListResponse {
  id: number
  publicName: string
  publicKey: string
  publicValue: string
  status: string
  publicType: string
  systemFlag: string
  remark: string
  gmtCreate: string
  gmtModified: string
}

/** 公共参数详情响应 */
export type SysPublicParamDetailResponse = SysPublicParamListResponse
