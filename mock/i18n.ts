import type { MockMethod } from 'vite-plugin-mock'
import { fail, ok, okVoid, page } from './_utils'

let nextId = 100
const records: Record<
  number,
  {
    id: number
    code: string
    language: string
    content: string
    gmtCreate: string
    gmtModified: string
  }
> = {
  1: {
    id: 1,
    code: 'common.confirm',
    language: 'zh-CN',
    content: '确认',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  2: {
    id: 2,
    code: 'common.confirm',
    language: 'en-US',
    content: 'Confirm',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  3: {
    id: 3,
    code: 'common.cancel',
    language: 'zh-CN',
    content: '取消',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  4: {
    id: 4,
    code: 'common.cancel',
    language: 'en-US',
    content: 'Cancel',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  5: {
    id: 5,
    code: 'common.save',
    language: 'zh-CN',
    content: '保存',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  6: {
    id: 6,
    code: 'common.save',
    language: 'en-US',
    content: 'Save',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  7: {
    id: 7,
    code: 'login.title',
    language: 'zh-CN',
    content: '系统登录',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  8: {
    id: 8,
    code: 'login.title',
    language: 'en-US',
    content: 'Login',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  9: {
    id: 9,
    code: 'user.username',
    language: 'zh-CN',
    content: '用户名',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
  10: {
    id: 10,
    code: 'user.username',
    language: 'en-US',
    content: 'Username',
    gmtCreate: '2025-01-01 00:00:00',
    gmtModified: '2025-01-01 00:00:00',
  },
}
nextId = 101

export default [
  {
    url: '/api/v1/sys/i18n/page',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      let list = Object.values(records)
      if (query.code) {
        list = list.filter((r) => r.code.includes(query.code))
      }
      if (query.language) {
        list = list.filter((r) => r.language === query.language)
      }
      const pageNo = parseInt(query.pageNo || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (pageNo - 1) * pageSize
      return ok(page(list.slice(start, start + pageSize), list.length, pageNo, pageSize))
    },
  },
  {
    url: /\/api\/v1\/sys\/i18n\/\d+$/,
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const urlParts = query.url?.split('/') || []
      const id = parseInt(urlParts[urlParts.length - 1])
      const r = records[id]
      if (!r) return fail(-1, '翻译不存在')
      return ok(r)
    },
  },
  {
    url: '/api/v1/sys/i18n',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const existing = Object.values(records).find(
        (r) => r.code === body.code && r.language === body.language
      )
      if (existing) return fail(-1, '该编码和语言的翻译已存在')
      const id = nextId++
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      records[id] = {
        id,
        code: body.code as string,
        language: body.language as string,
        content: body.content as string,
        gmtCreate: now,
        gmtModified: now,
      }
      return ok(id)
    },
  },
  {
    url: /\/api\/v1\/sys\/i18n\/\d+$/,
    method: 'put',
    response: ({ body, url }: { body: Record<string, unknown>; url: string }) => {
      const id = parseInt(url.split('/').pop()!)
      if (!records[id]) return fail(-1, '翻译不存在')
      records[id] = {
        ...records[id],
        content: (body.content as string) ?? records[id].content,
        gmtModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      return okVoid()
    },
  },
  {
    url: '/api/v1/sys/i18n',
    method: 'delete',
    response: ({ body }: { body: number[] }) => {
      body.forEach((id) => delete records[id])
      return okVoid()
    },
  },
] as MockMethod[]
