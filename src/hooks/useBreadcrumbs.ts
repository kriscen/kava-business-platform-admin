import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getBreadcrumbs } from '@/routes/config'

export interface BreadcrumbItem {
  path: string
  label: string
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const { t } = useTranslation()
  const location = useLocation()

  return useMemo(() => {
    const trail = getBreadcrumbs(location.pathname)
    if (trail.length === 0) {
      return [{ path: '/', label: t('layout.home') }]
    }
    return trail.map((item) => ({
      path: item.path,
      label: t(item.titleKey),
    }))
  }, [location.pathname, t])
}
