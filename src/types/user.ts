import type { PageQuery } from './common'

/** 用户查询参数 */
export interface SysUserQuery extends PageQuery {
  username?: string
  phone?: string
  deptId?: number
  tenantId?: number
  lockFlag?: string
}

/** 用户创建/更新请求 */
export interface SysUserRequest {
  id?: number
  username: string
  password?: string
  phone?: string
  avatar?: string
  deptId?: number
  tenantId?: number
  nickname?: string
  name?: string
  email?: string
  lockFlag?: string
  roleIds?: number[]
}

/** 用户列表响应 */
export interface SysUserListResponse {
  id: number
  username: string
  phone: string
  avatar: string
  nickname: string
  name: string
  email: string
  deptId: number
  deptName: string
  tenantId: number
  tenantName: string
  lockFlag: string
  roleIds: number[]
  gmtCreate: string
  gmtModified: string
}

/** 用户详情响应 */
export interface SysUserDetailResponse extends SysUserListResponse {
  roleNames: string[]
}
