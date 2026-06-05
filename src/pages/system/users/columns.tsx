import i18n from '@/i18n'
import type { SysUserListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysUserListResponse) => void
  onDelete: (row: SysUserListResponse) => void
}

export function getUserColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysUserListResponse>[] {
  return [
    { key: 'username', title: i18n.t('user.username') },
    { key: 'nickname', title: i18n.t('user.nickname') },
    { key: 'phone', title: i18n.t('user.phone') },
    { key: 'email', title: i18n.t('user.email') },
    { key: 'deptName', title: i18n.t('user.dept') },
    {
      key: 'lockFlag',
      title: i18n.t('user.status'),
      render: (val) => (
        <Badge variant={val === '0' ? 'default' : 'destructive'}>
          {val === '0' ? i18n.t('common.normal') : i18n.t('common.locked')}
        </Badge>
      ),
    },
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
