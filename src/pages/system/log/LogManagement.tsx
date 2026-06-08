import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysLogListResponse } from '@/types'
import { logApi } from '@/api/modules/log'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

import { getLogColumns } from './columns'

export default function LogManagement() {
  const { t } = useTranslation()
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLogType, setSearchLogType] = useState('')
  const [searchCreateBy, setSearchCreateBy] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [detailData, setDetailData] = useState<SysLogListResponse | null>(null)

  const searchParams = useMemo(
    () => ({
      title: searchTitle || undefined,
      logType: searchLogType || undefined,
      createBy: searchCreateBy || undefined,
    }),
    [searchTitle, searchLogType, searchCreateBy]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await logApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleViewDetail = useCallback(async (row: SysLogListResponse) => {
    try {
      const res = await logApi.getById(row.id)
      setDetailData((res.data as SysLogListResponse) ?? row)
    } catch {
      setDetailData(row)
    }
    setModalOpen(true)
  }, [])

  const columns = useMemo(
    () => getLogColumns({ onViewDetail: handleViewDetail }),
    [handleViewDetail]
  )

  const LOG_TYPE_OPTIONS = [
    { value: '', label: t('common.all') },
    { value: '0', label: t('log.logTypeOther') },
    { value: '1', label: t('log.logTypeInsert') },
    { value: '2', label: t('log.logTypeUpdate') },
    { value: '3', label: t('log.logTypeDelete') },
    { value: '4', label: t('log.logTypeQuery') },
    { value: '5', label: t('log.logTypeExport') },
    { value: '6', label: t('log.logTypeImport') },
  ]

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('log.title')}</span>
        <Input
          placeholder={t('log.searchTitle')}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('log.logType')}</span>
        <Select value={searchLogType} onValueChange={setSearchLogType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('common.all')} />
          </SelectTrigger>
          <SelectContent>
            {LOG_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('log.createBy')}</span>
        <Input
          placeholder={t('log.searchCreateBy')}
          value={searchCreateBy}
          onChange={(e) => setSearchCreateBy(e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('log.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('log.description')}</p>
      </div>

      <DataTable columns={columns} fetchData={fetchData} searchSlot={searchSlot} />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="edit"
        title={t('log.detailTitle')}
        onConfirm={() => setModalOpen(false)}
        width="sm:max-w-lg"
      >
        {detailData && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Label className="text-muted-foreground">{t('log.logType')}</Label>
                <p>{detailData.logType}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('log.title')}</Label>
                <p>{detailData.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('log.requestUri')}</Label>
                <p className="break-all">{detailData.requestUri}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('log.method')}</Label>
                <p>{detailData.method}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('log.serviceId')}</Label>
                <p>{detailData.serviceId}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('log.createBy')}</Label>
                <p>{detailData.createBy}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('log.gmtCreate')}</Label>
                <p>{detailData.gmtCreate}</p>
              </div>
              {'remoteAddr' in detailData && (
                <div>
                  <Label className="text-muted-foreground">{t('log.remoteAddr')}</Label>
                  <p>{(detailData as Record<string, unknown>).remoteAddr as string}</p>
                </div>
              )}
            </div>
            {'params' in detailData && (
              <div>
                <Label className="text-muted-foreground">{t('log.params')}</Label>
                <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-40">
                  {(detailData as Record<string, unknown>).params as string}
                </pre>
              </div>
            )}
            {'exception' in detailData && (detailData as Record<string, unknown>).exception && (
              <div>
                <Label className="text-muted-foreground">{t('log.exception')}</Label>
                <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-40 text-destructive">
                  {(detailData as Record<string, unknown>).exception as string}
                </pre>
              </div>
            )}
          </div>
        )}
      </FormModal>
    </div>
  )
}
