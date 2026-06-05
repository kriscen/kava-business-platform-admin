import i18n from '@/i18n'
import type { SysPublicParamListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysPublicParamListResponse) => void
  onDelete: (row: SysPublicParamListResponse) => void
}

export function getPublicParamColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysPublicParamListResponse>[] {
  return [
    { key: 'publicName', title: i18n.t('publicParam.publicName') },
    { key: 'publicKey', title: i18n.t('publicParam.publicKey') },
    { key: 'publicValue', title: i18n.t('publicParam.publicValue') },
    {
      key: 'status',
      title: i18n.t('publicParam.status'),
      render: (val) => (
        <Badge variant={val === '0' ? 'default' : 'destructive'}>
          {val === '0' ? i18n.t('common.normal') : i18n.t('common.locked')}
        </Badge>
      ),
    },
    {
      key: 'publicType',
      title: i18n.t('publicParam.publicType'),
      render: (val) =>
        val === '0' ? i18n.t('publicParam.typeSystem') : i18n.t('publicParam.typeCustom'),
    },
    {
      key: 'systemFlag',
      title: i18n.t('publicParam.systemFlag'),
      render: (val) => (val === '1' ? i18n.t('publicParam.yes') : i18n.t('publicParam.no')),
    },
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
