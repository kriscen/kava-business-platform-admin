import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysLogQuery,
  SysLogListResponse,
  SysLogDetailResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/log'

export const logApi = {
  getPage: (params: SysLogQuery): Promise<ApiResponse<PagingInfo<SysLogListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysLogDetailResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },
}
