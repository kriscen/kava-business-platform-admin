import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysAppQuery,
  SysAppRequest,
  SysAppListResponse,
  SysAppDetailResponse,
  SysAppDropdownResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/app'

export const appApi = {
  getPage: (params: SysAppQuery): Promise<ApiResponse<PagingInfo<SysAppListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysAppDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysAppRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (data: SysAppRequest): Promise<ApiResponse<boolean>> => {
    return request.put(BASE_URL, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<boolean>> => {
    return request.delete(BASE_URL, { data: ids })
  },

  dropdown: (): Promise<ApiResponse<SysAppDropdownResponse[]>> => {
    return request.get(BASE_URL + '/dropdown')
  },

  bindMenus: (id: number, menuIds: number[]): Promise<ApiResponse<boolean>> => {
    return request.put(`${BASE_URL}/${id}/menus`, menuIds)
  },
}
