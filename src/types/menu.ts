import type { PageQuery } from './common'

/** 菜单查询参数 */
export interface SysMenuQuery extends PageQuery {
  name?: string
  menuType?: string
  visible?: string
}

/** 菜单创建/更新请求 */
export interface SysMenuRequest {
  id?: number
  name: string
  permission?: string
  pid?: number
  path?: string
  component?: string
  icon?: string
  sortOrder?: number
  menuType: string
  visible?: string
  keepAlive?: string
  embedded?: string
}

/** 菜单列表/树形响应 */
export interface SysMenuListResponse {
  id: number
  name: string
  permission: string
  pid: number
  path: string
  component: string
  icon: string
  sortOrder: number
  menuType: string
  visible: string
  keepAlive: string
  embedded: string
  parentName: string
  children: SysMenuListResponse[]
}

/** 菜单详情响应 */
export interface SysMenuDetailResponse {
  id: number
  name: string
  permission: string
  pid: number
  path: string
  component: string
  icon: string
  sortOrder: number
  menuType: string
  visible: string
  keepAlive: string
  embedded: string
  parentName: string
}
