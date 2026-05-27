import type { PageQuery } from './common'

/** 角色查询参数 */
export interface SysRoleQuery extends PageQuery {
  roleName?: string
  roleCode?: string
}

/** 角色创建/更新请求 */
export interface SysRoleRequest {
  id?: number
  roleName: string
  roleCode: string
  roleDesc?: string
  dsType?: string
  dsScope?: string
  menuIds?: number[]
}

/** 角色列表响应 */
export interface SysRoleListResponse {
  id: number
  roleName: string
  roleCode: string
  roleDesc: string
  dsType: string
  gmtCreate: string
  gmtModified: string
}

/** 角色详情响应 */
export interface SysRoleDetailResponse extends SysRoleListResponse {
  menuIds: number[]
  menuNames: string[]
}

/** 角色下拉响应 */
export interface SysRoleDropdownResponse {
  id: number
  roleName: string
  roleCode: string
}
