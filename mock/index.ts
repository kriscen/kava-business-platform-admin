/**
 * Mock 模块统一导出
 */

import type { MockMethod } from 'vite-plugin-mock'
import authMocks from './auth'
import menuMocks from './menu'
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
import groupMocks from './group'

const mocks: MockMethod[] = [
  ...authMocks,
  ...menuMocks,
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
  ...groupMocks,
]

export default mocks
