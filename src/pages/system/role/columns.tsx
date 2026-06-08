import i18n from '@/i18n'
import type { SysRoleListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysRoleListResponse) => void
  onDelete: (row: SysRoleListResponse) => void
}

const DS_TYPE_MAP: Record<string, string> = {
  '0': 'dsTypeAll',
  '1': 'dsTypeCustom',
  '2': 'dsTypeDept',
  '3': 'dsTypeDeptAndBelow',
}

export function getRoleColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysRoleListResponse>[] {
  return [
    { key: 'roleName', title: i18n.t('role.roleName') },
    { key: 'roleCode', title: i18n.t('role.roleCode') },
    { key: 'roleDesc', title: i18n.t('role.roleDesc') },
    {
      key: 'dsType',
      title: i18n.t('role.dsType'),
      render: (value) => {
        const key = DS_TYPE_MAP[value as string]
        return key ? i18n.t(`role.${key}`) : (value as string)
      },
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
