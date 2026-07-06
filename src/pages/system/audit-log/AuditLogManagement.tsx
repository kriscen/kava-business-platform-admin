import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysAuditLogListResponse } from '@/types'
import type { CrudApi } from '@/hooks'
import { auditLogApi } from '@/api/modules/auditLog'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { getAuditLogColumns } from './columns'

export default function AuditLogManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const searchParams = useMemo(
    () => ({
      auditName: searchName || undefined,
    }),
    [searchName]
  )

  const { modal, handlers, tableProps } = useCrudPage<SysAuditLogListResponse>({
    api: {
      ...auditLogApi,
      remove: async () => ({
        success: true,
        data: null,
        errorCode: null,
        errorMessage: null,
      }),
    } as CrudApi<SysAuditLogListResponse>,
    searchParams,
    onFormSubmit: async () => {},
    confirmDeleteText: () => '',
  })

  const columns = useMemo(
    () => getAuditLogColumns({ onViewDetail: handlers.handleEdit }),
    [handlers.handleEdit]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('auditLog.auditName')}</span>
        <Input
          placeholder={t('auditLog.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-48"
        />
      </div>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('auditLog.title')}
      description={t('auditLog.description')}
      table={<DataTable columns={columns} searchSlot={searchSlot} {...tableProps} />}
      formModal={
        <FormModal
          open={modal.open}
          onOpenChange={handlers.setOpen}
          mode="edit"
          title={t('auditLog.detailTitle')}
          onConfirm={() => handlers.setOpen(false)}
          width="sm:max-w-lg"
        >
          {modal.editingDetail && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">{t('auditLog.auditName')}</Label>
                  <p>{modal.editingDetail.auditName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('auditLog.auditField')}</Label>
                  <p>{modal.editingDetail.auditField}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">{t('auditLog.beforeVal')}</Label>
                  <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-32">
                    {modal.editingDetail.beforeVal}
                  </pre>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">{t('auditLog.afterVal')}</Label>
                  <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-32">
                    {modal.editingDetail.afterVal}
                  </pre>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('auditLog.gmtCreate')}</Label>
                  <p>{modal.editingDetail.gmtCreate}</p>
                </div>
              </div>
            </div>
          )}
        </FormModal>
      }
    />
  )
}
