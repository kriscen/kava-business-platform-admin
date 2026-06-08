import i18n from '@/i18n'
import type { SysFileGroupListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysFileGroupListResponse) => void
  onDelete: (row: SysFileGroupListResponse) => void
}

export function getFileGroupColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysFileGroupListResponse>[] {
  return [
    { key: 'name', title: i18n.t('fileGroup.name') },
    { key: 'type', title: i18n.t('fileGroup.type') },
    { key: 'gmtCreate', title: i18n.t('fileGroup.gmtCreate') },
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
