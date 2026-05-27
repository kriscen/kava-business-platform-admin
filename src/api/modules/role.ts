import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysRoleQuery,
  SysRoleRequest,
  SysRoleListResponse,
  SysRoleDetailResponse,
  SysRoleDropdownResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/role'

export const roleApi = {
  getPage: (params: SysRoleQuery): Promise<ApiResponse<PagingInfo<SysRoleListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysRoleDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysRoleRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (data: SysRoleRequest): Promise<ApiResponse<boolean>> => {
    return request.put(BASE_URL, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<boolean>> => {
    return request.delete(BASE_URL, { data: ids })
  },

  getDropdown: (): Promise<ApiResponse<SysRoleDropdownResponse[]>> => {
    return request.get(BASE_URL + '/dropdown')
  },
}
