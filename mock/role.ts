import type { MockMethod } from 'vite-plugin-mock'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    roleName: string
    roleCode: string
    roleDesc: string
    dsType: string
    dsScope: string
    menuIds: number[]
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    roleName: '平台管理员',
    roleCode: 'platform_admin',
    roleDesc: '平台超级管理员',
    dsType: '0',
    dsScope: '',
    menuIds: [1, 2, 3, 4, 5, 6],
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    roleName: '租户管理员',
    roleCode: 'tenant_admin',
    roleDesc: '租户管理员',
    dsType: '3',
    dsScope: '',
    menuIds: [1, 3, 5],
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    roleName: '普通用户',
    roleCode: 'user',
    roleDesc: '普通用户角色',
    dsType: '2',
    dsScope: '',
    menuIds: [1],
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/role/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.roleName) {
        list = list.filter((r) => r.roleName.includes(query.roleName))
      }
      if (query.roleCode) {
        list = list.filter((r) => r.roleCode.includes(query.roleCode))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return {
        code: 0,
        data: {
          records: list.slice(start, start + pageSize).map((r) => ({
            id: r.id,
            roleName: r.roleName,
            roleCode: r.roleCode,
            roleDesc: r.roleDesc,
            dsType: r.dsType,
            gmtCreate: r.gmtCreate,
            gmtModified: r.gmtModified,
          })),
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
    url: /\/api\/v1\/sys\/role\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '角色不存在' }
      return {
        code: 0,
        data: { ...r, menuNames: ['仪表盘', '用户管理'] },
        message: 'success',
      }
    },
  },
  {
    url: '/api/v1/sys/role',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        roleName: body.roleName as string,
        roleCode: body.roleCode as string,
        roleDesc: (body.roleDesc as string) || '',
        dsType: (body.dsType as string) || '0',
        dsScope: (body.dsScope as string) || '',
        menuIds: (body.menuIds as number[]) || [],
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/role',
    method: 'put',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = body.id as number
      if (!records[id]) return { code: -1, message: '角色不存在' }
      records[id] = {
        ...records[id],
        roleName: (body.roleName as string) ?? records[id].roleName,
        roleCode: (body.roleCode as string) ?? records[id].roleCode,
        roleDesc: (body.roleDesc as string) ?? records[id].roleDesc,
        dsType: (body.dsType as string) ?? records[id].dsType,
        dsScope: (body.dsScope as string) ?? records[id].dsScope,
        menuIds: (body.menuIds as number[]) ?? records[id].menuIds,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, data: true, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/role',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, data: true, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/role/dropdown',
    method: 'get',
    response: () => ({
      code: 0,
      data: Object.values(records).map((r) => ({
        id: r.id,
        roleName: r.roleName,
        roleCode: r.roleCode,
      })),
      message: 'success',
    }),
  },
] as MockMethod[]
