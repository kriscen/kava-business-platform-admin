import type { PageQuery } from './common'

/** 路由配置查询参数 */
export interface SysRouteConfQuery extends PageQuery {
  routeName?: string
}

/** 路由配置创建/更新请求 */
export interface SysRouteConfRequest {
  id?: number
  routeId: string
  routeName: string
  predicates: string
  filters: string
  uri: string
  sortOrder?: number
  metadata?: string
}

/** 路由配置列表响应 */
export interface SysRouteConfListResponse {
  id: number
  routeId: string
  routeName: string
  predicates: string
  filters: string
  uri: string
  sortOrder: number
  metadata: string
  gmtCreate: string
  gmtModified: string
}

/** 路由配置详情响应 */
export interface SysRouteConfDetailResponse {
  id: number
  routeId: string
  routeName: string
  predicates: string
  filters: string
  uri: string
  sortOrder: number
  metadata: string
  gmtCreate: string
  gmtModified: string
}
