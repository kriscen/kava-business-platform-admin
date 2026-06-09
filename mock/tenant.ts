import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    name: string
    code: string
    tenantDomain: string
    websiteName: string
    logo: string
    footer: string
    startTime: string
    endTime: string
    status: string
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    name: '演示租户',
    code: 'DEMO',
    tenantDomain: 'demo.example.com',
    websiteName: '演示平台',
    logo: '',
    footer: '© 2025 Demo',
    startTime: '2025-01-01 00:00:00',
    endTime: '2026-12-31 23:59:59',
    status: '0',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    name: '测试租户',
    code: 'TEST',
    tenantDomain: 'test.example.com',
    websiteName: '测试平台',
    logo: '',
    footer: '© 2025 Test',
    startTime: '2025-03-01 00:00:00',
    endTime: '2026-03-01 00:00:00',
    status: '0',
    gmtCreate: '2025-03-01 00:00:00',
    gmtModified: '2025-03-01 00:00:00',
  },
  3: {
    id: 3,
    name: '已禁用租户',
    code: 'DISABLED',
    tenantDomain: 'disabled.example.com',
    websiteName: '已禁用',
    logo: '',
    footer: '',
    startTime: '2025-01-01 00:00:00',
    endTime: '2025-06-30 23:59:59',
    status: '9',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-06-01 00:00:00',
  },
}
nextId = 101

// In-memory tenant-app subscription data
const tenantApps: Record<number, { appId: number; gmtCreate: string }[]> = {
  1: [
    { appId: 1, gmtCreate: '2025-01-15 10:00:00' },
    { appId: 2, gmtCreate: '2025-02-01 14:30:00' },
  ],
  2: [{ appId: 1, gmtCreate: '2025-03-05 09:00:00' }],
}

// App data lookup (mirrors mock/app.ts records)
const appRecords: Record<
  number,
  { id: number; code: string; name: string; icon: string; status: string }
> = {
  1: { id: 1, code: 'kava-admin', name: 'Kava 管理后台', icon: 'Settings', status: '0' },
  2: { id: 2, code: 'kava-portal', name: 'Kava 门户', icon: 'Globe', status: '0' },
  3: { id: 3, code: 'kava-mobile', name: 'Kava 移动端', icon: 'Smartphone', status: '9' },
}

function toResponse(r: (typeof records)[number]) {
  return {
    id: r.id,
    name: r.name,
    code: r.code,
    tenantDomain: r.tenantDomain,
    websiteName: r.websiteName,
    logo: r.logo,
    footer: r.footer,
    startTime: r.startTime,
    endTime: r.endTime,
    status: r.status,
    gmtCreate: r.gmtCreate,
    gmtModified: r.gmtModified,
  }
}

export default [
  {
    url: '/api/v1/sys/tenant/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records).map(toResponse)
      if (query.name) list = list.filter((r) => r.name.includes(query.name))
      if (query.code) list = list.filter((r) => r.code.includes(query.code))
      if (query.status) list = list.filter((r) => r.status === query.status)
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
    url: '/api/v1/sys/tenant/dropdown',
    method: 'get',
    response: () => ({
      code: 0,
      data: Object.values(records)
        .filter((r) => r.status === '0')
        .map((r) => ({ id: r.id, name: r.name, code: r.code, status: r.status })),
      message: 'success',
    }),
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+$/,
    method: 'get',
    response: ({ url }: { url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      const r = records[id]
      if (!r) return { code: -1, message: '租户不存在' }
      return { code: 0, data: toResponse(r), message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/tenant',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        name: body.name as string,
        code: body.code as string,
        tenantDomain: (body.tenantDomain as string) || '',
        websiteName: (body.websiteName as string) || '',
        logo: (body.logo as string) || '',
        footer: (body.footer as string) || '',
        startTime: (body.startTime as string) || '',
        endTime: (body.endTime as string) || '',
        status: '0',
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const segments = url.split('/')
      const id = parseInt(segments.pop()!)
      if (!records[id]) return { code: -1, message: '租户不存在' }
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        ...records[id],
        name: (body.name as string) ?? records[id].name,
        code: (body.code as string) ?? records[id].code,
        tenantDomain: (body.tenantDomain as string) ?? records[id].tenantDomain,
        websiteName: (body.websiteName as string) ?? records[id].websiteName,
        logo: (body.logo as string) ?? records[id].logo,
        footer: (body.footer as string) ?? records[id].footer,
        startTime: (body.startTime as string) ?? records[id].startTime,
        endTime: (body.endTime as string) ?? records[id].endTime,
        status: (body.status as string) ?? records[id].status,
        gmtModified: now,
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+\/enable$/,
    method: 'put',
    response: ({ url }: { url: string }) => {
      const parts = url.split('/')
      const id = parseInt(parts[parts.length - 2])
      if (!records[id]) return { code: -1, message: '租户不存在' }
      records[id].status = '0'
      return { code: 0, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+\/disable$/,
    method: 'put',
    response: ({ url }: { url: string }) => {
      const parts = url.split('/')
      const id = parseInt(parts[parts.length - 2])
      if (!records[id]) return { code: -1, message: '租户不存在' }
      records[id].status = '9'
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/tenant',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => {
        delete records[id]
        delete tenantApps[id]
      })
      return { code: 0, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+\/apps$/,
    method: 'get',
    response: ({ url }: { url: string }) => {
      const parts = url.split('/')
      const tenantId = parseInt(parts[parts.length - 2])
      const subs = tenantApps[tenantId] || []
      const data = subs
        .map((s) => {
          const app = appRecords[s.appId]
          if (!app) return null
          return {
            id: s.appId,
            tenantId,
            appId: s.appId,
            appCode: app.code,
            appName: app.name,
            appIcon: app.icon,
            status: app.status,
            gmtCreate: s.gmtCreate,
          }
        })
        .filter(Boolean)
      return { code: 0, data, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+\/apps$/,
    method: 'post',
    response: ({ url, body }: { url: string; body: Record<string, unknown> }) => {
      const parts = url.split('/')
      const tenantId = parseInt(parts[parts.length - 2])
      const appId = body.appId as number
      if (!tenantApps[tenantId]) tenantApps[tenantId] = []
      if (tenantApps[tenantId].some((s) => s.appId === appId)) {
        return { code: 10100001, msg: '该应用已订阅' }
      }
      tenantApps[tenantId].push({
        appId,
        gmtCreate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      })
      return { code: 0, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/tenant\/\d+\/apps\/\d+$/,
    method: 'delete',
    response: ({ url }: { url: string }) => {
      const parts = url.split('/')
      const appId = parseInt(parts.pop()!)
      const tenantId = parseInt(parts[parts.length - 2])
      if (appId === 1) {
        return { code: 10100002, msg: '系统应用不可退订' }
      }
      if (tenantApps[tenantId]) {
        tenantApps[tenantId] = tenantApps[tenantId].filter((s) => s.appId !== appId)
      }
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
