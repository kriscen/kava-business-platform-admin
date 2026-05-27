/**
 * 类型定义统一导出
 */

export type { RequestConfig, ApiResponse } from './api'
export type { PageQuery, PagingInfo, DropdownItem, IdParam } from './common'
export type {
  SysUserQuery,
  SysUserRequest,
  SysUserListResponse,
  SysUserDetailResponse,
} from './user'
export type {
  SysRoleQuery,
  SysRoleRequest,
  SysRoleListResponse,
  SysRoleDetailResponse,
  SysRoleDropdownResponse,
} from './role'
export type {
  SysMenuQuery,
  SysMenuRequest,
  SysMenuListResponse,
  SysMenuDetailResponse,
} from './menu'
export type {
  SysDeptQuery,
  SysDeptRequest,
  SysDeptListResponse,
  SysDeptDetailResponse,
} from './dept'
export type {
  SysTenantQuery,
  SysTenantRequest,
  SysTenantListResponse,
  SysTenantDropdownResponse,
} from './tenant'
export type { MenuItem, LayoutConfig } from './layout'
export type { ErrorType, ErrorInfo } from './error'
