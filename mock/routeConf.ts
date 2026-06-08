import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    routeId: string
    routeName: string
    predicates: string
    filters: string
    uri: string
    sortOrder: number
    metadata: string
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    routeId: 'upms-route',
    routeName: 'UPMS 服务路由',
    predicates: '[{"name":"Path","args":{"pattern":"/upms/**"}}]',
    filters: '[{"name":"StripPrefix","args":{"parts":"1"}}]',
    uri: 'lb://kbpd-upms',
    sortOrder: 1,
    metadata: '{}',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    routeId: 'auth-route',
    routeName: '认证中心路由',
    predicates: '[{"name":"Path","args":{"pattern":"/auth/**"}}]',
    filters: '[{"name":"StripPrefix","args":{"parts":"1"}}]',
    uri: 'lb://kbpd-auth',
    sortOrder: 2,
    metadata: '{"response-timeout":"5000"}',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    routeId: 'member-route',
    routeName: '会员服务路由',
    predicates: '[{"name":"Path","args":{"pattern":"/member/**"}}]',
    filters: '[]',
    uri: 'lb://kbpd-member',
    sortOrder: 3,
    metadata: '{}',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/route-conf/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.routeName) {
        list = list.filter((r) => r.routeName.includes(query.routeName))
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
    url: /\/api\/v1\/sys\/route-conf\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '路由配置不存在' }
      return { code: 0, data: r, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/route-conf',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        routeId: body.routeId as string,
        routeName: body.routeName as string,
        predicates: (body.predicates as string) || '[]',
        filters: (body.filters as string) || '[]',
        uri: body.uri as string,
        sortOrder: (body.sortOrder as number) || 0,
        metadata: (body.metadata as string) || '{}',
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/route-conf\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '路由配置不存在' }
      records[id] = {
        ...records[id],
        routeId: (body.routeId as string) ?? records[id].routeId,
        routeName: (body.routeName as string) ?? records[id].routeName,
        predicates: (body.predicates as string) ?? records[id].predicates,
        filters: (body.filters as string) ?? records[id].filters,
        uri: (body.uri as string) ?? records[id].uri,
        sortOrder: (body.sortOrder as number) ?? records[id].sortOrder,
        metadata: (body.metadata as string) ?? records[id].metadata,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/route-conf',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
