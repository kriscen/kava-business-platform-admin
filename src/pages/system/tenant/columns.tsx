import i18n from '@/i18n'
import type { SysTenantListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysTenantListResponse) => void
  onDelete: (row: SysTenantListResponse) => void
  onToggleStatus: (row: SysTenantListResponse) => void
  onAppSubscription: (row: SysTenantListResponse) => void
}

export function getTenantColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  onAppSubscription,
}: ColumnsConfig): DataTableColumn<SysTenantListResponse>[] {
  return [
    { key: 'name', title: i18n.t('tenant.name') },
    { key: 'code', title: i18n.t('tenant.code') },
    { key: 'tenantDomain', title: i18n.t('tenant.domain') },
    { key: 'websiteName', title: i18n.t('tenant.websiteName') },
    { key: 'startTime', title: i18n.t('tenant.startTime') },
    { key: 'endTime', title: i18n.t('tenant.endTime') },
    {
      key: 'status',
      title: i18n.t('tenant.status'),
      render: (val) => (
        <Badge variant={val === '0' ? 'default' : 'destructive'}>
          {val === '0' ? i18n.t('tenant.active') : i18n.t('tenant.expired')}
        </Badge>
      ),
    },
    { key: 'gmtCreate', title: i18n.t('user.createTime') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onAppSubscription(row)}>
            {i18n.t('tenant.appSubscription')}
          </Button>
          <Button variant="ghost" size="xs" onClick={() => onEdit(row)}>
            {i18n.t('common.edit')}
          </Button>
          <Button variant="ghost" size="xs" onClick={() => onToggleStatus(row)}>
            {row.status === '0' ? i18n.t('tenant.disable') : i18n.t('tenant.enable')}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive"
            onClick={() => onDelete(row)}
          >
            {i18n.t('common.delete')}
          </Button>
        </div>
      ),
    },
  ]
}
