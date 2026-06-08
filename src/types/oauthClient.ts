import type { PageQuery } from './common'

/** OAuth 客户端查询参数 */
export interface SysOauthClientQuery extends PageQuery {
  clientId?: string
}

/** OAuth 客户端创建/更新请求 */
export interface SysOauthClientRequest {
  id?: number
  clientId: string
  clientSecret: string
  scope: string
  authorizedGrantTypes: string[]
  webServerRedirectUri?: string
  accessTokenValidity?: number
  refreshTokenValidity?: number
  autoapprove?: string
  tenantId?: number
  userType?: string
}

/** OAuth 客户端列表响应 */
export interface SysOauthClientListResponse {
  id: number
  clientId: string
  scope: string
  authorizedGrantTypes: string[]
  webServerRedirectUri: string
  accessTokenValidity: number
  refreshTokenValidity: number
  autoapprove: string
  tenantId: number
  tenantName: string
  userType: string
  gmtCreate: string
  gmtModified: string
}

/** OAuth 客户端详情响应 */
export interface SysOauthClientDetailResponse {
  id: number
  clientId: string
  clientSecret: string
  scope: string
  authorizedGrantTypes: string[]
  webServerRedirectUri: string
  accessTokenValidity: number
  refreshTokenValidity: number
  autoapprove: string
  tenantId: number
  tenantName: string
  userType: string
  gmtCreate: string
  gmtModified: string
}
