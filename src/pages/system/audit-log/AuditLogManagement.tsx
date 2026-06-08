import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysAuditLogListResponse } from '@/types'
import { auditLogApi } from '@/api/modules/auditLog'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { getAuditLogColumns } from './columns'

export default function AuditLogManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [detailData, setDetailData] = useState<SysAuditLogListResponse | null>(null)

  const searchParams = useMemo(
    () => ({
      auditName: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await auditLogApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleViewDetail = useCallback(async (row: SysAuditLogListResponse) => {
    try {
      const res = await auditLogApi.getById(row.id)
      setDetailData((res.data as SysAuditLogListResponse) ?? row)
    } catch {
      setDetailData(row)
    }
    setModalOpen(true)
  }, [])

  const columns = useMemo(
    () => getAuditLogColumns({ onViewDetail: handleViewDetail }),
    [handleViewDetail]
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
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('auditLog.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('auditLog.description')}</p>
      </div>

      <DataTable columns={columns} fetchData={fetchData} searchSlot={searchSlot} />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="edit"
        title={t('auditLog.detailTitle')}
        onConfirm={() => setModalOpen(false)}
        width="sm:max-w-lg"
      >
        {detailData && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Label className="text-muted-foreground">{t('auditLog.auditName')}</Label>
                <p>{detailData.auditName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('auditLog.auditField')}</Label>
                <p>{detailData.auditField}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">{t('auditLog.beforeVal')}</Label>
                <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-32">
                  {detailData.beforeVal}
                </pre>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">{t('auditLog.afterVal')}</Label>
                <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-32">
                  {detailData.afterVal}
                </pre>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('auditLog.gmtCreate')}</Label>
                <p>{detailData.gmtCreate}</p>
              </div>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  )
}
