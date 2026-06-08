import i18n from '@/i18n'
import type { SysOauthClientListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysOauthClientListResponse) => void
  onDelete: (row: SysOauthClientListResponse) => void
}

export function getOAuthClientColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysOauthClientListResponse>[] {
  return [
    { key: 'clientId', title: i18n.t('oauthClient.clientId') },
    { key: 'scope', title: i18n.t('oauthClient.scope') },
    {
      key: 'authorizedGrantTypes',
      title: i18n.t('oauthClient.authorizedGrantTypes'),
      render: (value) =>
        Array.isArray(value) ? (value as string[]).join(', ') : String(value ?? ''),
    },
    { key: 'webServerRedirectUri', title: i18n.t('oauthClient.webServerRedirectUri') },
    { key: 'tenantName', title: i18n.t('oauthClient.tenantId') },
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
