import type { PageQuery } from './common'

/** 文件分组查询参数 */
export interface SysFileGroupQuery extends PageQuery {
  name?: string
}

/** 文件分组创建/更新请求 */
export interface SysFileGroupRequest {
  id?: number
  name: string
  pid?: number
  type: string
}

/** 文件分组列表响应 */
export interface SysFileGroupListResponse {
  id: number
  name: string
  pid: number
  type: string
  gmtCreate: string
}

/** 文件分组详情响应 */
export type SysFileGroupDetailResponse = SysFileGroupListResponse
