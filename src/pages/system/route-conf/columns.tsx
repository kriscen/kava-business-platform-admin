import i18n from '@/i18n'
import type { SysRouteConfListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysRouteConfListResponse) => void
  onDelete: (row: SysRouteConfListResponse) => void
}

export function getRouteConfColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysRouteConfListResponse>[] {
  return [
    { key: 'routeId', title: i18n.t('routeConf.routeId') },
    { key: 'routeName', title: i18n.t('routeConf.routeName') },
    { key: 'uri', title: i18n.t('routeConf.uri') },
    { key: 'sortOrder', title: i18n.t('routeConf.sortOrder') },
    { key: 'gmtCreate', title: i18n.t('user.createTime') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onEdit(row)}>
            {i18n.t('common.edit')}
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
