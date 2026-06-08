import type { PageQuery } from './common'

/** 区域查询参数 */
export interface SysAreaQuery extends PageQuery {
  name?: string
  areaType?: string
}

/** 区域创建/更新请求 */
export interface SysAreaRequest {
  id?: number
  pid?: number
  name: string
  adcode?: number
  areaType?: string
  areaStatus?: string
  cityCode?: string
}

/** 区域列表/树形响应 */
export interface SysAreaListResponse {
  id: number
  pid: number
  name: string
  adcode: number
  areaType: string
  areaStatus: string
  cityCode: string
  parentName: string
  children: SysAreaListResponse[]
  gmtCreate: string
}

/** 区域详情响应 */
export interface SysAreaDetailResponse {
  id: number
  pid: number
  name: string
  adcode: number
  areaType: string
  areaStatus: string
  cityCode: string
  parentName: string
  gmtCreate: string
}
