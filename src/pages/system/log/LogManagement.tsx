import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysLogListResponse, SysLogDetailResponse } from '@/types'
import type { CrudApi } from '@/hooks'
import { logApi } from '@/api/modules/log'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
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

  const searchParams = useMemo(
    () => ({
      title: searchTitle || undefined,
      logType: searchLogType || undefined,
      createBy: searchCreateBy || undefined,
    }),
    [searchTitle, searchLogType, searchCreateBy]
  )

  const { modal, handlers, tableProps } = useCrudPage<SysLogListResponse, SysLogDetailResponse>({
    api: { ...logApi, remove: async () => {} } as unknown as CrudApi<SysLogListResponse>,
    searchParams,
    onFormSubmit: async () => {},
    confirmDeleteText: () => '',
  })

  const columns = useMemo(
    () => getLogColumns({ onViewDetail: handlers.handleEdit }),
    [handlers.handleEdit]
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
    <CrudPageLayout
      title={t('log.title')}
      description={t('log.description')}
      table={<DataTable columns={columns} searchSlot={searchSlot} {...tableProps} />}
      formModal={
        <FormModal
          open={modal.open}
          onOpenChange={handlers.setOpen}
          mode="edit"
          title={t('log.detailTitle')}
          onConfirm={() => handlers.setOpen(false)}
          width="sm:max-w-lg"
        >
          {modal.editingDetail && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">{t('log.logType')}</Label>
                  <p>{modal.editingDetail.logType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('log.title')}</Label>
                  <p>{modal.editingDetail.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('log.requestUri')}</Label>
                  <p className="break-all">{modal.editingDetail.requestUri}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('log.method')}</Label>
                  <p>{modal.editingDetail.method}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('log.serviceId')}</Label>
                  <p>{modal.editingDetail.serviceId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('log.createBy')}</Label>
                  <p>{modal.editingDetail.createBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('log.gmtCreate')}</Label>
                  <p>{modal.editingDetail.gmtCreate}</p>
                </div>
                {modal.editingDetail.remoteAddr && (
                  <div>
                    <Label className="text-muted-foreground">{t('log.remoteAddr')}</Label>
                    <p>{modal.editingDetail.remoteAddr}</p>
                  </div>
                )}
              </div>
              {modal.editingDetail.params && (
                <div>
                  <Label className="text-muted-foreground">{t('log.params')}</Label>
                  <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-40">
                    {modal.editingDetail.params}
                  </pre>
                </div>
              )}
              {modal.editingDetail.exception && (
                <div>
                  <Label className="text-muted-foreground">{t('log.exception')}</Label>
                  <pre className="mt-1 rounded bg-muted p-2 text-xs overflow-auto max-h-40 text-destructive">
                    {modal.editingDetail.exception}
                  </pre>
                </div>
              )}
            </div>
          )}
        </FormModal>
      }
    />
  )
}
