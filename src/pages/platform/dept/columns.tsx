import i18n from '@/i18n'
import type { SysDeptListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysDeptListResponse) => void
  onDelete: (row: SysDeptListResponse) => void
}

export function getDeptColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysDeptListResponse>[] {
  return [
    { key: 'name', title: i18n.t('dept.name') },
    { key: 'parentName', title: i18n.t('dept.parentDept') },
    { key: 'sortOrder', title: i18n.t('dept.sortOrder') },
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
