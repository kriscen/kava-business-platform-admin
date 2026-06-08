import i18n from '@/i18n'
import type { SysLogListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onViewDetail: (row: SysLogListResponse) => void
}

const LOG_TYPE_MAP: Record<string, string> = {
  '0': 'logTypeOther',
  '1': 'logTypeInsert',
  '2': 'logTypeUpdate',
  '3': 'logTypeDelete',
  '4': 'logTypeQuery',
  '5': 'logTypeExport',
  '6': 'logTypeImport',
}

export function getLogColumns({
  onViewDetail,
}: ColumnsConfig): DataTableColumn<SysLogListResponse>[] {
  return [
    {
      key: 'logType',
      title: i18n.t('log.logType'),
      render: (value) => {
        const key = LOG_TYPE_MAP[value as string]
        return key ? i18n.t(`log.${key}`) : (value as string)
      },
    },
    { key: 'title', title: i18n.t('log.logTitle') },
    { key: 'requestUri', title: i18n.t('log.requestUri') },
    { key: 'method', title: i18n.t('log.method') },
    { key: 'serviceId', title: i18n.t('log.serviceId') },
    { key: 'createBy', title: i18n.t('log.createBy') },
    { key: 'gmtCreate', title: i18n.t('log.gmtCreate') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <Button variant="ghost" size="xs" onClick={() => onViewDetail(row)}>
          {i18n.t('log.viewDetail')}
        </Button>
      ),
    },
  ]
}
