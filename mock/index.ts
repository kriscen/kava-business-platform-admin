/**
 * Mock 模块统一导出
 */

import type { MockMethod } from 'vite-plugin-mock'
import authMocks from './auth'
import userMocks from './user'
import systemMocks from './system'
import menuMocks from './menu'
import deptMocks from './dept'
import tenantMocks from './tenant'
import publicParamMocks from './publicParam'
import roleMocks from './role'
import i18nMocks from './i18n'
import areaMocks from './area'
import routeConfMocks from './routeConf'
import oauthClientMocks from './oauthClient'
import logMocks from './log'
import auditLogMocks from './auditLog'
import fileMocks from './file'
import fileGroupMocks from './fileGroup'
import appMocks from './app'

const mocks: MockMethod[] = [
  ...authMocks,
  ...userMocks,
  ...systemMocks,
  ...menuMocks,
  ...deptMocks,
  ...tenantMocks,
  ...publicParamMocks,
  ...roleMocks,
  ...i18nMocks,
  ...areaMocks,
  ...routeConfMocks,
  ...oauthClientMocks,
  ...logMocks,
  ...auditLogMocks,
  ...fileMocks,
  ...fileGroupMocks,
  ...appMocks,
]

export default mocks
