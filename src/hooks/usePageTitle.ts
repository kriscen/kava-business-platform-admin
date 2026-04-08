import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { findRouteConfig } from '@/routes/config'

/**
 * 页面标题 Hook
 *
 * @param overrideTitle - 可选的手动覆盖标题
 * @returns 当前页面标题
 *
 * @example
 * // 自动模式
 * const title = usePageTitle()
 *
 * @example
 * // 手动覆盖模式
 * const title = usePageTitle('自定义标题')
 */
export function usePageTitle(overrideTitle?: string): string {
  const { t } = useTranslation()
  const location = useLocation()

  return useMemo(() => {
    if (overrideTitle) {
      return overrideTitle
    }

    // 查找当前路由配置
    const routeConfig = findRouteConfig(location.pathname)

    if (routeConfig) {
      // 尝试翻译
      const translated = t(routeConfig.titleKey)
      // 如果翻译结果等于 key，说明 key 不存在，回退到路径
      return translated === routeConfig.titleKey ? routeConfig.path : translated
    }

    // 没有配置，回退到路径
    return location.pathname
  }, [location.pathname, overrideTitle, t])
}
