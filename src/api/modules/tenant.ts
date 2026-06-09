import { request } from '@/api'
import type {
  ApiResponse,
  PagingInfo,
  SysTenantQuery,
  SysTenantRequest,
  SysTenantListResponse,
  SysTenantDropdownResponse,
  SysTenantAppListResponse,
} from '@/types'

const BASE_URL = '/api/v1/sys/tenant'

export const tenantApi = {
  getPage: (params: SysTenantQuery): Promise<ApiResponse<PagingInfo<SysTenantListResponse>>> => {
    return request.get(BASE_URL + '/page', { params })
  },

  getById: (id: number): Promise<ApiResponse<SysTenantListResponse>> => {
    return request.get(`${BASE_URL}/${id}`)
  },

  create: (data: SysTenantRequest): Promise<ApiResponse<number>> => {
    return request.post(BASE_URL, data)
  },

  update: (id: number, data: SysTenantRequest): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  remove: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete(BASE_URL, { data: ids })
  },

  enable: (id: number): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}/enable`)
  },

  disable: (id: number): Promise<ApiResponse<void>> => {
    return request.put(`${BASE_URL}/${id}/disable`)
  },

  getDropdown: (): Promise<ApiResponse<SysTenantDropdownResponse[]>> => {
    return request.get(BASE_URL + '/dropdown')
  },

  getApps: (tenantId: number): Promise<ApiResponse<SysTenantAppListResponse[]>> => {
    return request.get(`${BASE_URL}/${tenantId}/apps`)
  },

  subscribeApp: (tenantId: number, appId: number): Promise<ApiResponse<void>> => {
    return request.post(`${BASE_URL}/${tenantId}/apps`, { appId })
  },

  unsubscribeApp: (tenantId: number, appId: number): Promise<ApiResponse<void>> => {
    return request.delete(`${BASE_URL}/${tenantId}/apps/${appId}`)
  },
}
