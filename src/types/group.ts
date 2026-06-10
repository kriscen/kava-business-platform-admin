import type { PageQuery } from './common'

/** 分组查询参数 */
export interface SysGroupQuery extends PageQuery {
  name?: string
}

/** 分组创建/更新请求 */
export interface SysGroupRequest {
  id?: number
  name: string
  pid?: number
  sortOrder?: number
}

/** 分组列表/树形响应 */
export interface SysGroupListResponse {
  id: number
  pid: number
  name: string
  sortOrder: number
  parentName: string
  children: SysGroupListResponse[]
  gmtCreate: string
}

/** 分组详情响应 */
export interface SysGroupDetailResponse {
  id: number
  pid: number
  name: string
  sortOrder: number
  parentName: string
  gmtCreate: string
}
