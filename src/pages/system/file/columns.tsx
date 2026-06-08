import i18n from '@/i18n'
import type { SysFileListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysFileListResponse) => void
  onDelete: (row: SysFileListResponse) => void
}

export function getFileColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysFileListResponse>[] {
  return [
    { key: 'fileName', title: i18n.t('file.fileName') },
    { key: 'original', title: i18n.t('file.original') },
    { key: 'bucketName', title: i18n.t('file.bucketName') },
    { key: 'dir', title: i18n.t('file.dir') },
    { key: 'type', title: i18n.t('file.type') },
    {
      key: 'fileSize',
      title: i18n.t('file.fileSize'),
      render: (value) => {
        const size = value as number
        if (size < 1024) return `${size} B`
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
        return `${(size / (1024 * 1024)).toFixed(1)} MB`
      },
    },
    { key: 'gmtCreate', title: i18n.t('file.gmtCreate') },
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
