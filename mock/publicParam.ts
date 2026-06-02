import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    publicName: string
    publicKey: string
    publicValue: string
    status: string
    publicType: string
    systemFlag: string
    remark: string
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    publicName: '用户初始密码',
    publicKey: 'sys.user.initPassword',
    publicValue: '123456',
    status: '0',
    publicType: '0',
    systemFlag: '1',
    remark: '新建用户的默认初始密码',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    publicName: '账号锁定阈值',
    publicKey: 'sys.user.lockThreshold',
    publicValue: '5',
    status: '0',
    publicType: '0',
    systemFlag: '1',
    remark: '连续登录失败次数达到此值后锁定账号',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    publicName: '会话超时时间',
    publicKey: 'sys.session.timeout',
    publicValue: '1800',
    status: '0',
    publicType: '0',
    systemFlag: '0',
    remark: '会话超时时间（秒）',
    gmtCreate: '2025-02-01 00:00:00',
    gmtModified: '2025-02-01 00:00:00',
  },
}
nextId = 101

function toResponse(r: (typeof records)[number]) {
  return {
    id: r.id,
    publicName: r.publicName,
    publicKey: r.publicKey,
    publicValue: r.publicValue,
    status: r.status,
    publicType: r.publicType,
    systemFlag: r.systemFlag,
    remark: r.remark,
    gmtCreate: r.gmtCreate,
    gmtModified: r.gmtModified,
  }
}

export default [
  {
    url: '/api/v1/sys/public-param/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records).map(toResponse)
      if (query.publicName) list = list.filter((r) => r.publicName.includes(query.publicName))
      if (query.publicKey) list = list.filter((r) => r.publicKey.includes(query.publicKey))
      if (query.publicType) list = list.filter((r) => r.publicType === query.publicType)
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
    url: /\/api\/v1\/sys\/public-param\/\d+$/,
    method: 'get',
    response: ({ url }: { url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      const r = records[id]
      if (!r) return { code: -1, message: '参数不存在' }
      return { code: 0, data: toResponse(r), message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/public-param',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        publicName: body.publicName as string,
        publicKey: body.publicKey as string,
        publicValue: body.publicValue as string,
        status: (body.status as string) || '0',
        publicType: (body.publicType as string) || '0',
        systemFlag: (body.systemFlag as string) || '0',
        remark: (body.remark as string) || '',
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: /\/api\/v1\/sys\/public-param\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return { code: -1, message: '参数不存在' }
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        ...records[id],
        publicName: (body.publicName as string) ?? records[id].publicName,
        publicKey: (body.publicKey as string) ?? records[id].publicKey,
        publicValue: (body.publicValue as string) ?? records[id].publicValue,
        status: (body.status as string) ?? records[id].status,
        publicType: (body.publicType as string) ?? records[id].publicType,
        systemFlag: (body.systemFlag as string) ?? records[id].systemFlag,
        remark: (body.remark as string) ?? records[id].remark,
        gmtModified: now,
      }
      return { code: 0, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/public-param',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, message: 'success' }
    },
  },
] as MockMethod[]
