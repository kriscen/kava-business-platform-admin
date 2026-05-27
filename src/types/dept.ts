import type { PageQuery } from './common'

/** 部门查询参数 */
export interface SysDeptQuery extends PageQuery {
  name?: string
}

/** 部门创建/更新请求 */
export interface SysDeptRequest {
  id?: number
  name: string
  pid?: number
  sortOrder?: number
}

/** 部门列表/树形响应 */
export interface SysDeptListResponse {
  id: number
  name: string
  sortOrder: number
  pid: number
  parentName: string
  children: SysDeptListResponse[]
  gmtCreate: string
}

/** 部门详情响应 */
export interface SysDeptDetailResponse {
  id: number
  name: string
  sortOrder: number
  pid: number
  parentName: string
  gmtCreate: string
}
