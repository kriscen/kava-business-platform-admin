import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysTenantAppListResponse, SysAppDropdownResponse } from '@/types'
import { tenantApi } from '@/api/modules/tenant'
import { appApi } from '@/api/modules/app'
import { confirm } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AppSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: number
}

export function AppSubscriptionModal({ open, onOpenChange, tenantId }: AppSubscriptionModalProps) {
  const { t } = useTranslation()
  const [apps, setApps] = useState<SysTenantAppListResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [allApps, setAllApps] = useState<SysAppDropdownResponse[]>([])
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  const [subscribing, setSubscribing] = useState(false)

  const fetchSubscribedApps = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tenantApi.getApps(tenantId)
      setApps(res.data ?? [])
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    if (open) {
      fetchSubscribedApps()
      appApi.dropdown().then((res) => setAllApps(res.data ?? []))
    }
  }, [open, fetchSubscribedApps])

  const handleSubscribe = async () => {
    if (!selectedAppId) return
    setSubscribing(true)
    try {
      await tenantApi.subscribeApp(tenantId, Number(selectedAppId))
      toast.success(t('tenant.subscribeSuccess'))
      setSelectedAppId('')
      fetchSubscribedApps()
    } catch {
      // error toast handled by interceptor
    } finally {
      setSubscribing(false)
    }
  }

  const handleUnsubscribe = async (app: SysTenantAppListResponse) => {
    try {
      const confirmed = await confirm({
        title: t('tenant.unsubscribeConfirm', { name: app.appName }),
        variant: 'destructive',
        confirmText: t('tenant.unsubscribe'),
        onConfirm: async () => {
          await tenantApi.unsubscribeApp(tenantId, app.appId)
        },
      })
      if (!confirmed) return
      toast.success(t('tenant.unsubscribeSuccess'))
      fetchSubscribedApps()
    } catch (error: unknown) {
      const err = error as { errorCode?: string | number; code?: string | number }
      const errorCode = err?.errorCode ?? err?.code
      if (String(errorCode) === '10100002') {
        toast.error(t('tenant.systemAppNoUnsubscribe'))
      }
    }
  }

  const subscribedIds = new Set(apps.map((a) => a.appId))
  const availableApps = allApps.filter((a) => !subscribedIds.has(a.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('tenant.appSubscription')}</DialogTitle>
          <DialogDescription className="sr-only">{t('tenant.appSubscription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h4 className="mb-2 text-sm font-medium">{t('tenant.subscribedApps')}</h4>
            {loading ? (
              <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
            ) : apps.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('tenant.noSubscribedApps')}</p>
            ) : (
              <div className="space-y-2">
                {apps.map((app) => (
                  <div
                    key={app.appId}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{app.appName}</span>
                      <span className="text-xs text-muted-foreground">{app.appCode}</span>
                      <Badge variant={app.status === '0' ? 'default' : 'destructive'}>
                        {app.status === '0' ? t('tenant.active') : t('tenant.expired')}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-destructive"
                      onClick={() => handleUnsubscribe(app)}
                    >
                      {t('tenant.unsubscribe')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-2 text-sm font-medium">{t('tenant.subscribeNewApp')}</h4>
            <div className="flex items-center gap-2">
              <Select
                value={selectedAppId}
                onValueChange={(value) => setSelectedAppId(value ?? '')}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t('tenant.selectApp')} />
                </SelectTrigger>
                <SelectContent>
                  {availableApps.map((app) => (
                    <SelectItem key={app.id} value={String(app.id)}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSubscribe} disabled={!selectedAppId || subscribing}>
                {subscribing ? t('common.submitting') : t('tenant.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
