import type { PageQuery } from './common'

/** 租户查询参数 */
export interface SysTenantQuery extends PageQuery {
  name?: string
  code?: string
  status?: string
}

/** 租户创建/更新请求 */
export interface SysTenantRequest {
  id?: number
  name: string
  code: string
  tenantDomain?: string
  websiteName?: string
  logo?: string
  footer?: string
  startTime?: string
  endTime?: string
  status?: string
  adminUsername?: string
  adminPassword?: string
}

/** 租户列表/详情响应 */
export interface SysTenantListResponse {
  id: number
  name: string
  code: string
  tenantDomain: string
  websiteName: string
  logo: string
  footer: string
  startTime: string
  endTime: string
  status: string
  gmtCreate: string
  gmtModified: string
}

/** 租户下拉响应 */
export interface SysTenantDropdownResponse {
  id: number
  name: string
  code: string
  status: string
}
