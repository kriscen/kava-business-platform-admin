import i18n from '@/i18n'
import type { SysAreaListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

const AREA_TYPE_MAP: Record<string, string> = {
  '0': 'areaTypeCountry',
  '1': 'areaTypeProvince',
  '2': 'areaTypeCity',
  '3': 'areaTypeDistrict',
}

const AREA_STATUS_MAP: Record<string, { label: string; className: string }> = {
  '0': { label: 'areaStatusDisabled', className: 'text-destructive' },
  '1': { label: 'areaStatusEnabled', className: 'text-green-600' },
}

interface ColumnsConfig {
  onEdit: (row: SysAreaListResponse) => void
  onDelete: (row: SysAreaListResponse) => void
  onAddChild: (row: SysAreaListResponse) => void
}

export function getAreaColumns({
  onEdit,
  onDelete,
  onAddChild,
}: ColumnsConfig): DataTableColumn<SysAreaListResponse>[] {
  return [
    { key: 'name', title: i18n.t('area.name') },
    { key: 'adcode', title: i18n.t('area.adcode') },
    {
      key: 'areaType',
      title: i18n.t('area.areaType'),
      render: (value) => {
        const key = AREA_TYPE_MAP[value as string]
        return key ? i18n.t(`area.${key}`) : (value as string)
      },
    },
    {
      key: 'areaStatus',
      title: i18n.t('area.areaStatus'),
      render: (value) => {
        const info = AREA_STATUS_MAP[value as string]
        return info ? (
          <span className={info.className}>{i18n.t(`area.${info.label}`)}</span>
        ) : (
          (value as string)
        )
      },
    },
    { key: 'cityCode', title: i18n.t('area.cityCode') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onAddChild(row)}>
            {i18n.t('area.addSubArea')}
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
