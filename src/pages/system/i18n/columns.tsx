import i18n from '@/i18n'
import type { SysI18nListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysI18nListResponse) => void
  onDelete: (row: SysI18nListResponse) => void
}

export function getI18nColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysI18nListResponse>[] {
  return [
    { key: 'code', title: i18n.t('i18n.code') },
    { key: 'language', title: i18n.t('i18n.language') },
    { key: 'content', title: i18n.t('i18n.content') },
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
