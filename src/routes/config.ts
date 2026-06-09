/**
 * 路由配置类型
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string
  /** 标题 i18n key (namespace.key) */
  titleKey: string
  /** 父级路由路径（用于面包屑） */
  parentPath?: string
  /** 子路由 */
  children?: RouteConfig[]
}

/**
 * 路由配置
 */
export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    titleKey: 'layout.home',
  },
  {
    path: '/platform',
    titleKey: 'layout.platform',
    children: [
      {
        path: '/platform/dashboard',
        titleKey: 'layout.dashboard',
        parentPath: '/platform',
      },
      {
        path: '/platform/system',
        titleKey: 'layout.system',
        parentPath: '/platform',
        children: [
          {
            path: '/platform/system/users',
            titleKey: 'layout.userManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/tenant',
            titleKey: 'layout.tenantManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/public-param',
            titleKey: 'layout.publicParamManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/role',
            titleKey: 'layout.roleManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/menu',
            titleKey: 'layout.menuManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/area',
            titleKey: 'layout.areaManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/i18n',
            titleKey: 'layout.i18nManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/route-conf',
            titleKey: 'layout.routeConfManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/oauth-client',
            titleKey: 'layout.oauthClientManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/log',
            titleKey: 'layout.logManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/audit-log',
            titleKey: 'layout.auditLogManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/file',
            titleKey: 'layout.fileManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/file-group',
            titleKey: 'layout.fileGroupManagement',
            parentPath: '/platform/system',
          },
          {
            path: '/platform/system/app',
            titleKey: 'layout.appManagement',
            parentPath: '/platform/system',
          },
        ],
      },
    ],
  },
  {
    path: '/tenant',
    titleKey: 'layout.tenant',
    children: [
      {
        path: '/tenant/dashboard',
        titleKey: 'layout.dashboard',
        parentPath: '/tenant',
      },
      {
        path: '/tenant/profile',
        titleKey: 'layout.profile',
        parentPath: '/tenant',
      },
      {
        path: '/tenant/system',
        titleKey: 'layout.system',
        parentPath: '/tenant',
        children: [
          {
            path: '/tenant/system/users',
            titleKey: 'layout.userManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/tenant',
            titleKey: 'layout.tenantManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/public-param',
            titleKey: 'layout.publicParamManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/role',
            titleKey: 'layout.roleManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/menu',
            titleKey: 'layout.menuManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/area',
            titleKey: 'layout.areaManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/i18n',
            titleKey: 'layout.i18nManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/route-conf',
            titleKey: 'layout.routeConfManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/oauth-client',
            titleKey: 'layout.oauthClientManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/log',
            titleKey: 'layout.logManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/audit-log',
            titleKey: 'layout.auditLogManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/file',
            titleKey: 'layout.fileManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/file-group',
            titleKey: 'layout.fileGroupManagement',
            parentPath: '/tenant/system',
          },
          {
            path: '/tenant/system/app',
            titleKey: 'layout.appManagement',
            parentPath: '/tenant/system',
          },
        ],
      },
    ],
  },
]

/**
 * 根据路径查找路由配置（支持嵌套查找）
 */
export function findRouteConfig(
  path: string,
  routes: RouteConfig[] = routeConfig
): RouteConfig | undefined {
  for (const route of routes) {
    if (route.path === path) {
      return route
    }
    if (route.children) {
      const found = findRouteConfig(path, route.children)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

/**
 * 根据路径查找面包屑配置
 */
export function getBreadcrumbs(path: string): Array<{ path: string; titleKey: string }> {
  const trail: Array<{ path: string; titleKey: string }> = []

  function search(
    routes: RouteConfig[],
    ancestors: Array<{ path: string; titleKey: string }>
  ): boolean {
    for (const route of routes) {
      const current = [...ancestors, { path: route.path, titleKey: route.titleKey }]
      if (route.path === path) {
        trail.push(...current)
        return true
      }
      if (route.children && search(route.children, current)) {
        return true
      }
    }
    return false
  }

  search(routeConfig, [])
  return trail
}
