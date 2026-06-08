import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
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
> = {
  1: {
    id: 1,
    clientId: 'kbpd-admin',
    clientSecret: '$2a$10$secret1',
    scope: 'server',
    authorizedGrantTypes: ['authorization_code', 'refresh_token', 'password'],
    webServerRedirectUri: 'http://localhost:5173/oauth/callback',
    accessTokenValidity: 43200,
    refreshTokenValidity: 2592000,
    autoapprove: 'true',
    tenantId: 1,
    tenantName: '平台租户',
    userType: 'B',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    clientId: 'kbpd-app',
    clientSecret: '$2a$10$secret2',
    scope: 'server',
    authorizedGrantTypes: ['authorization_code', 'refresh_token'],
    webServerRedirectUri: 'https://app.example.com/callback',
    accessTokenValidity: 3600,
    refreshTokenValidity: 86400,
    autoapprove: 'false',
    tenantId: 2,
    tenantName: '示例租户',
    userType: 'C',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/oauth-client/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.clientId) {
        list = list.filter((r) => r.clientId.includes(query.clientId))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return {
        code: 0,
        data: {
          records: list.slice(start, start + pageSize),
          total: list.length,
          size: pageSize,
          current: pageNo,
          pages: Math.ceil(list.length / pageSize),
        },
        message: 'success',
      }
    },
  },
  {
    url: /\/api\/v1\/sys\/oauth-client\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '客户端不存在' }
      return { code: 0, data: r, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/oauth-client',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        clientId: body.clientId as string,
        clientSecret: body.clientSecret as string,
        scope: (body.scope as string) || 'server',
        authorizedGrantTypes: (body.authorizedGrantTypes as string[]) || [],
        webServerRedirectUri: (body.webServerRedirectUri as string) || '',
        accessTokenValidity: (body.accessTokenValidity as number) || 43200,
        refreshTokenValidity: (body.refreshTokenValidity as number) || 2592000,
        autoapprove: (body.autoapprove as string) || 'false',
        tenantId: (body.tenantId as number) || 0,
        tenantName: '',
        userType: (body.userType as string) || 'B',
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/oauth-client\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '客户端不存在' }
      records[id] = {
        ...records[id],
        clientId: (body.clientId as string) ?? records[id].clientId,
        clientSecret: (body.clientSecret as string) ?? records[id].clientSecret,
        scope: (body.scope as string) ?? records[id].scope,
        authorizedGrantTypes:
          (body.authorizedGrantTypes as string[]) ?? records[id].authorizedGrantTypes,
        webServerRedirectUri:
          (body.webServerRedirectUri as string) ?? records[id].webServerRedirectUri,
        accessTokenValidity:
          (body.accessTokenValidity as number) ?? records[id].accessTokenValidity,
        refreshTokenValidity:
          (body.refreshTokenValidity as number) ?? records[id].refreshTokenValidity,
        autoapprove: (body.autoapprove as string) ?? records[id].autoapprove,
        tenantId: (body.tenantId as number) ?? records[id].tenantId,
        userType: (body.userType as string) ?? records[id].userType,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/oauth-client',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
