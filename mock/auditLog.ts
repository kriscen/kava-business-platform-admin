import type { MockMethod } from 'vite-plugin-mock'

const records: Record<
  number,
  {
    id: number
    auditName: string
    auditField: string
    beforeVal: string
    afterVal: string
    createBy: string
    requestUri: string
    method: string
    gmtCreate: string
  }
> = {
  1: {
    id: 1,
    auditName: '用户信息变更',
    auditField: 'nickname',
    beforeVal: '"张三"',
    afterVal: '"张三丰"',
    createBy: 'admin',
    requestUri: '/api/v1/sys/user',
    method: 'PUT',
    gmtCreate: '2025-06-01 10:30:00',
  },
  2: {
    id: 2,
    auditName: '角色权限变更',
    auditField: 'menuIds',
    beforeVal: '[1,2,3]',
    afterVal: '[1,2,3,4,5]',
    createBy: 'admin',
    requestUri: '/api/v1/sys/role',
    method: 'PUT',
    gmtCreate: '2025-06-01 11:00:00',
  },
  3: {
    id: 3,
    auditName: '租户配置变更',
    auditField: 'status',
    beforeVal: '"0"',
    afterVal: '"1"',
    createBy: 'admin',
    requestUri: '/api/v1/sys/tenant',
    method: 'PUT',
    gmtCreate: '2025-06-02 09:15:00',
  },
  4: {
    id: 4,
    auditName: '菜单排序变更',
    auditField: 'sort',
    beforeVal: '1',
    afterVal: '5',
    createBy: 'admin',
    requestUri: '/api/v1/sys/menu',
    method: 'PUT',
    gmtCreate: '2025-06-02 14:20:00',
  },
  5: {
    id: 5,
    auditName: '部门信息变更',
    auditField: 'deptName',
    beforeVal: '"技术部"',
    afterVal: '"技术研发部"',
    createBy: 'admin',
    requestUri: '/api/v1/sys/dept',
    method: 'PUT',
    gmtCreate: '2025-06-03 08:00:00',
  },
}

export default [
  {
    url: '/api/v1/sys/audit-log/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.auditName) {
        list = list.filter((r) => r.auditName.includes(query.auditName))
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return {
        code: 0,
        data: {
          records: list.slice(start, start + pageSize).map((r) => ({
            id: r.id,
            auditName: r.auditName,
            auditField: r.auditField,
            beforeVal: r.beforeVal,
            afterVal: r.afterVal,
            gmtCreate: r.gmtCreate,
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
    url: /\/api\/v1\/sys\/audit-log\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return { code: -1, message: '审计日志不存在' }
      return { code: 0, data: r, message: 'success' }
    },
  },
] as MockMethod[]
