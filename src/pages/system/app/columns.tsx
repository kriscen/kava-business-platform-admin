import i18n from '@/i18n'
import type { SysAppListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysAppListResponse) => void
  onDelete: (row: SysAppListResponse) => void
  onBindMenus: (row: SysAppListResponse) => void
}

export function getAppColumns({
  onEdit,
  onDelete,
  onBindMenus,
}: ColumnsConfig): DataTableColumn<SysAppListResponse>[] {
  return [
    { key: 'code', title: i18n.t('app.code') },
    { key: 'name', title: i18n.t('app.name') },
    { key: 'icon', title: i18n.t('app.icon') },
    {
      key: 'status',
      title: i18n.t('app.status'),
      render: (val) => (
        <Badge variant={val === '0' ? 'default' : 'destructive'}>
          {val === '0' ? i18n.t('common.normal') : i18n.t('common.disabled')}
        </Badge>
      ),
    },
    { key: 'gmtCreate', title: i18n.t('app.gmtCreate') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onEdit(row)}>
            {i18n.t('common.edit')}
          </Button>
          <Button variant="ghost" size="xs" onClick={() => onBindMenus(row)}>
            {i18n.t('app.bindMenus')}
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
