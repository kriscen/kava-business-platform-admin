import type { MockMethod } from 'vite-plugin-mock'

const groupLookup: Record<number, string> = {
  1: '总部',
  2: '技术部',
  3: '市场部',
  4: '运营部',
  5: '前端组',
  6: '后端组',
  7: '测试组',
  8: '品牌推广组',
  9: '渠道运营组',
  10: '用户运营组',
  11: '内容运营组',
}
const roleLookup: Record<number, string> = { 1: '平台管理员', 2: '租户管理员', 3: '普通用户' }
const tenantLookup: Record<number, string> = { 1: '演示租户', 2: '测试租户', 3: '已禁用租户' }

let nextId = 100

interface MockUser {
  id: number
  username: string
  phone: string
  avatar: string
  nickname: string
  name: string
  email: string
  groupId: number
  groupName: string
  tenantId: number
  tenantName: string
  lockFlag: string
  roleIds: number[]
  roleNames: string[]
  gmtCreate: string
  gmtModified: string
}

const records: Record<number, MockUser> = {
  1: {
    id: 1,
    username: 'admin',
    phone: '13800000001',
    avatar: '',
    nickname: '超级管理员',
    name: '管理员',
    email: 'admin@example.com',
    groupId: 1,
    groupName: '总公司',
    tenantId: 1,
    tenantName: 'Demo租户',
    lockFlag: '0',
    roleIds: [1],
    roleNames: ['平台管理员'],
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    username: 'tenant',
    phone: '13800000002',
    avatar: '',
    nickname: '租户管理员',
    name: '租户管理',
    email: 'tenant@example.com',
    groupId: 2,
    groupName: '技术部',
    tenantId: 1,
    tenantName: 'Demo租户',
    lockFlag: '0',
    roleIds: [2],
    roleNames: ['租户管理员'],
    gmtCreate: '2025-01-02 00:00:00',
    gmtModified: '2025-01-02 00:00:00',
  },
  3: {
    id: 3,
    username: 'zhangsan',
    phone: '13800000003',
    avatar: '',
    nickname: '张三',
    name: '张三',
    email: 'zhangsan@example.com',
    groupId: 3,
    groupName: '前端组',
    tenantId: 1,
    tenantName: 'Demo租户',
    lockFlag: '0',
    roleIds: [3],
    roleNames: ['普通用户'],
    gmtCreate: '2025-01-03 00:00:00',
    gmtModified: '2025-01-03 00:00:00',
  },
  4: {
    id: 4,
    username: 'lisi',
    phone: '13800000004',
    avatar: '',
    nickname: '李四',
    name: '李四',
    email: 'lisi@example.com',
    groupId: 4,
    groupName: '后端组',
    tenantId: 1,
    tenantName: 'Demo租户',
    lockFlag: '0',
    roleIds: [2, 3],
    roleNames: ['租户管理员', '普通用户'],
    gmtCreate: '2025-01-04 00:00:00',
    gmtModified: '2025-01-04 00:00:00',
  },
  5: {
    id: 5,
    username: 'disabled_user',
    phone: '13800000005',
    avatar: '',
    nickname: '已禁用用户',
    name: '王五',
    email: 'wangwu@example.com',
    groupId: 5,
    groupName: '测试组',
    tenantId: 2,
    tenantName: '测试租户',
    lockFlag: '9',
    roleIds: [3],
    roleNames: ['普通用户'],
    gmtCreate: '2025-01-05 00:00:00',
    gmtModified: '2025-01-05 00:00:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/user/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.username) {
        list = list.filter((u) => u.username.includes(query.username))
      }
      if (query.phone) {
        list = list.filter((u) => u.phone.includes(query.phone))
      }
      if (query.lockFlag) {
        list = list.filter((u) => u.lockFlag === query.lockFlag)
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
    url: /\/api\/v1\/sys\/user\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const u = records[id]
      if (!u) return { code: -1, message: '用户不存在' }
      return { code: 0, data: { ...u }, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/user',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const groupId = (body.groupId as number) || 0
      const tenantId = (body.tenantId as number) || 0
      const roleIds = (body.roleIds as number[]) || []
      records[id] = {
        id,
        username: body.username as string,
        phone: (body.phone as string) || '',
        avatar: (body.avatar as string) || '',
        nickname: (body.nickname as string) || '',
        name: (body.name as string) || '',
        email: (body.email as string) || '',
        groupId,
        groupName: groupLookup[groupId] ?? '',
        tenantId,
        tenantName: tenantLookup[tenantId] ?? '',
        lockFlag: (body.lockFlag as string) || '0',
        roleIds,
        roleNames: roleIds.map((rid) => roleLookup[rid]).filter(Boolean),
        gmtCreate: now,
        gmtModified: now,
      }
      return { code: 0, data: id, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/user',
    method: 'put',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const id = body.id as number
      if (!records[id]) return { code: -1, message: '用户不存在' }
      records[id] = {
        ...records[id],
        username: (body.username as string) ?? records[id].username,
        phone: (body.phone as string) ?? records[id].phone,
        nickname: (body.nickname as string) ?? records[id].nickname,
        name: (body.name as string) ?? records[id].name,
        email: (body.email as string) ?? records[id].email,
        groupId: (body.groupId as number) ?? records[id].groupId,
        tenantId: (body.tenantId as number) ?? records[id].tenantId,
        lockFlag: (body.lockFlag as string) ?? records[id].lockFlag,
        roleIds: (body.roleIds as number[]) ?? records[id].roleIds,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return { code: 0, data: true, message: 'success' }
    },
  },
  {
    url: '/api/v1/sys/user',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return { code: 0, data: true, message: 'success' }
    },
  },
] as MockMethod[]
