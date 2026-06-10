import i18n from '@/i18n'
import type { SysGroupListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysGroupListResponse) => void
  onDelete: (row: SysGroupListResponse) => void
  onAddChild: (row: SysGroupListResponse) => void
}

export function getGroupColumns({
  onEdit,
  onDelete,
  onAddChild,
}: ColumnsConfig): DataTableColumn<SysGroupListResponse>[] {
  return [
    { key: 'name', title: i18n.t('group.name') },
    { key: 'sortOrder', title: i18n.t('group.sortOrder') },
    { key: 'parentName', title: i18n.t('group.parentGroup') },
    { key: 'gmtCreate', title: i18n.t('group.gmtCreate') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onAddChild(row)}>
            {i18n.t('group.addSubGroup')}
          </Button>
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
