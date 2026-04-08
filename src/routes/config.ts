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
 * 使用 layout namespace 的 i18n key
 */
export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    titleKey: 'layout.home',
  },
  {
    path: '/dashboard',
    titleKey: 'layout.dashboard',
  },
  {
    path: '/system',
    titleKey: 'layout.system',
    children: [
      {
        path: '/system/users',
        titleKey: 'layout.userManagement',
        parentPath: '/system',
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
  const breadcrumbs: Array<{ path: string; titleKey: string }> = []

  // 遍历一级路由
  for (const route of routeConfig) {
    if (path === route.path) {
      breadcrumbs.push({ path: route.path, titleKey: route.titleKey })
      return breadcrumbs
    }
    if (route.children) {
      for (const child of route.children) {
        if (path === child.path) {
          // 添加父级
          breadcrumbs.push({ path: route.path, titleKey: route.titleKey })
          // 添加当前
          breadcrumbs.push({ path: child.path, titleKey: child.titleKey })
          return breadcrumbs
        }
      }
    }
  }

  return breadcrumbs
}
