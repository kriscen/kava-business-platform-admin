import type { PageQuery, DropdownItem } from './common'

/** 应用查询参数 */
export interface SysAppQuery extends PageQuery {
  appName?: string
}

/** 应用创建/更新请求 */
export interface SysAppRequest {
  id?: number
  code: string
  name: string
  icon?: string
  description?: string
}

/** 应用列表响应 */
export interface SysAppListResponse {
  id: number
  code: string
  name: string
  icon: string
  status: string
  gmtCreate: string
}

/** 应用详情响应 */
export interface SysAppDetailResponse extends SysAppListResponse {
  description: string
  menuIds: number[]
}

/** 应用下拉项 */
export type SysAppDropdownResponse = DropdownItem

/** 应用菜单绑定请求 */
export interface SysAppBindMenusRequest {
  menuIds: number[]
}
