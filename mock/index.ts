/**
 * Mock 模块统一导出
 */

import type { MockMethod } from 'vite-plugin-mock'
import authMocks from './auth'
import userMocks from './user'
import systemMocks from './system'
import menuMocks from './menu'

const mocks: MockMethod[] = [...authMocks, ...userMocks, ...systemMocks, ...menuMocks]

export default mocks
