import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { routeConfig } from '@/routes/config'

/**
 * 面包屑项类型
 */
export interface BreadcrumbItem {
  /** 路由路径 */
  path: string
  /** 显示文本 */
  label: string
}

/**
 * 面包屑 Hook
 *
 * @returns 面包屑项数组
 *
 * @example
 * const breadcrumbs = useBreadcrumbs()
 * // 返回: [{ path: '/', label: '首页' }, { path: '/system', label: '系统管理' }]
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const { t } = useTranslation()
  const location = useLocation()

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [{ path: '/', label: t('layout.home') || '首页' }]

    // 遍历一级路由
    for (const route of routeConfig) {
      // 精确匹配
      if (location.pathname === route.path) {
        return breadcrumbs
      }

      // 检查子路由
      if (route.children) {
        for (const child of route.children) {
          if (location.pathname === child.path) {
            breadcrumbs.push({
              path: route.path,
              label: t(route.titleKey) === route.titleKey ? route.path : t(route.titleKey),
            })
            breadcrumbs.push({
              path: child.path,
              label: t(child.titleKey) === child.titleKey ? child.path : t(child.titleKey),
            })
            return breadcrumbs
          }
        }
      }
    }

    // 默认只返回首页
    return breadcrumbs
  }, [location.pathname, t])
}
