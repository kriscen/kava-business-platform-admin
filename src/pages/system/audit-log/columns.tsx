import i18n from '@/i18n'
import type { SysAuditLogListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onViewDetail: (row: SysAuditLogListResponse) => void
}

export function getAuditLogColumns({
  onViewDetail,
}: ColumnsConfig): DataTableColumn<SysAuditLogListResponse>[] {
  return [
    { key: 'auditName', title: i18n.t('auditLog.auditName') },
    { key: 'auditField', title: i18n.t('auditLog.auditField') },
    { key: 'beforeVal', title: i18n.t('auditLog.beforeVal') },
    { key: 'afterVal', title: i18n.t('auditLog.afterVal') },
    { key: 'gmtCreate', title: i18n.t('auditLog.gmtCreate') },
    {
      key: 'id',
      title: i18n.t('common.actions'),
      render: (_, row) => (
        <Button variant="ghost" size="xs" onClick={() => onViewDetail(row)}>
          {i18n.t('auditLog.viewDetail')}
        </Button>
      ),
    },
  ]
}
