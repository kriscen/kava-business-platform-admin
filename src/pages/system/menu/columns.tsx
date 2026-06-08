import i18n from '@/i18n'
import type { SysMenuListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

const MENU_TYPE_MAP: Record<string, string> = {
  '0': 'menuTypeMenu',
  '1': 'menuTypeButton',
}

const VISIBLE_MAP: Record<string, string> = {
  '0': 'visibleShow',
  '1': 'visibleHide',
}

interface ColumnsConfig {
  onEdit: (row: SysMenuListResponse) => void
  onDelete: (row: SysMenuListResponse) => void
  onAddChild: (row: SysMenuListResponse) => void
}

export function getMenuColumns({
  onEdit,
  onDelete,
  onAddChild,
}: ColumnsConfig): DataTableColumn<SysMenuListResponse>[] {
  return [
    { key: 'name', title: i18n.t('menu.name') },
    { key: 'permission', title: i18n.t('menu.permission') },
    { key: 'path', title: i18n.t('menu.path') },
    { key: 'component', title: i18n.t('menu.component') },
    { key: 'icon', title: i18n.t('menu.icon') },
    { key: 'sortOrder', title: i18n.t('menu.sortOrder') },
    {
      key: 'menuType',
      title: i18n.t('menu.menuType'),
      render: (value) => {
        const key = MENU_TYPE_MAP[value as string]
        return key ? i18n.t(`menu.${key}`) : (value as string)
      },
    },
    {
      key: 'visible',
      title: i18n.t('menu.visible'),
      render: (value) => {
        const key = VISIBLE_MAP[value as string]
        return key ? i18n.t(`menu.${key}`) : (value as string)
      },
    },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onAddChild(row)}>
            {i18n.t('menu.addSubMenu')}
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
