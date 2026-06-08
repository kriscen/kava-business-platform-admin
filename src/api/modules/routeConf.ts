import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysRouteConfQuery,
  SysRouteConfRequest,
  SysRouteConfListResponse,
  SysRouteConfDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/route-conf'

export const routeConfApi = {
  getPage: (
    params: SysRouteConfQuery
  ): Promise<ApiResponse<PagingInfo<SysRouteConfListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysRouteConfDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysRouteConfRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysRouteConfRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
