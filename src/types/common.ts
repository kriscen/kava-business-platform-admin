/**
 * 通用类型定义
 */

/** 通用分页查询参数 */
export interface PageQuery {
  pageNo?: number
  pageSize?: number
}

/** 后端分页响应结构 */
export interface PagingInfo<T> {
  list: T[]
  total: number
  pageNo: number
  pageSize: number
}

/** 下拉选项 */
export interface DropdownItem {
  id: number
  name?: string
  code?: string
}

/** ID 参数 */
export interface IdParam {
  id: number
}
