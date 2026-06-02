import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysPublicParamQuery,
  SysPublicParamRequest,
  SysPublicParamListResponse,
  SysPublicParamDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/public-param'

export const publicParamApi = {
  getPage: (
    params: SysPublicParamQuery
  ): Promise<ApiResponse<PagingInfo<SysPublicParamListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysPublicParamDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysPublicParamRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysPublicParamRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },
}
