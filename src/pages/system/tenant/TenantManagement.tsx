import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysTenantListResponse, SysTenantRequest } from '@/types'
import { tenantApi } from '@/api/modules/tenant'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { confirm } from '@/components/confirm-dialog'
import { useCrudPage } from '@/hooks'

import { TenantForm, type TenantFormValues } from './tenant-form'
import { getTenantColumns } from './columns'
import { AppSubscriptionModal } from './app-subscription-modal'

export default function TenantManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [searchStatus, setSearchStatus] = useState('')

  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false)
  const [currentTenantId, setCurrentTenantId] = useState<number>(0)

  const searchParams = useMemo(
    () => ({
      name: searchName || undefined,
      code: searchCode || undefined,
      status: searchStatus || undefined,
    }),
    [searchName, searchCode, searchStatus]
  )

  const { modal, handlers, refresh, tableProps } = useCrudPage<SysTenantListResponse>({
    api: tenantApi,
    searchParams,
    confirmDeleteText: (row) => t('tenant.confirmDelete', { name: row.name }),
    onFormSubmit: async (values: TenantFormValues, mode) => {
      const data: SysTenantRequest = {
        name: values.name,
        code: values.code,
        tenantDomain: values.tenantDomain,
        websiteName: values.websiteName,
        logo: values.logo,
        footer: values.footer,
        startTime: values.startTime,
        endTime: values.endTime,
        status: values.status,
      }
      if (mode === 'create') {
        data.adminUsername = values.adminUsername
        data.adminPassword = values.adminPassword
        await tenantApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await tenantApi.update(data.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const handleToggleStatus = useCallback(
    async (row: SysTenantListResponse) => {
      const isEnable = row.status !== '0'
      const confirmed = await confirm({
        title: t(isEnable ? 'tenant.confirmEnable' : 'tenant.confirmDisable', { name: row.name }),
        confirmText: t(isEnable ? 'tenant.enable' : 'tenant.disable'),
        onConfirm: async () => {
          if (isEnable) {
            await tenantApi.enable(row.id)
          } else {
            await tenantApi.disable(row.id)
          }
        },
      })
      if (!confirmed) return
      toast.success(t('common.editSuccess'))
      refresh()
    },
    [refresh, t]
  )

  const handleAppSubscription = useCallback((row: SysTenantListResponse) => {
    setCurrentTenantId(row.id)
    setSubscribeDialogOpen(true)
  }, [])

  const columns = useMemo(
    () =>
      getTenantColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
        onToggleStatus: handleToggleStatus,
        onAppSubscription: handleAppSubscription,
      }),
    [handlers.handleEdit, handlers.handleDelete, handleToggleStatus, handleAppSubscription]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('tenant.name')}</span>
        <Input
          placeholder={t('tenant.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('tenant.code')}</span>
        <Input
          placeholder={t('tenant.searchCode')}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('tenant.status')}</span>
        <Select
          value={searchStatus}
          onValueChange={(v) => setSearchStatus(!v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('common.all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="0">{t('tenant.active')}</SelectItem>
            <SelectItem value="9">{t('tenant.expired')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('tenant.addTenant')}</Button>
    </div>
  )

  return (
    <>
      <CrudPageLayout
        title={t('tenant.title')}
        description={t('tenant.description')}
        searchSlot={searchSlot}
        toolbarSlot={toolbarSlot}
        table={
          <DataTable
            columns={columns}
            fetchData={tableProps.fetchData}
            refreshKey={tableProps.refreshKey}
          />
        }
        formModal={
          <FormModal
            open={modal.open}
            onOpenChange={handlers.setOpen}
            mode={modal.mode}
            title={t('tenant.formTitle')}
            submitting={modal.submitting}
            onConfirm={() => modal.formRef.current?.requestSubmit()}
          >
            <TenantForm
              mode={modal.mode}
              initialValues={modal.editingItem ?? undefined}
              onSubmit={handlers.handleFormSubmit}
              formRef={modal.formRef}
            />
          </FormModal>
        }
      />
      <AppSubscriptionModal
        open={subscribeDialogOpen}
        onOpenChange={setSubscribeDialogOpen}
        tenantId={currentTenantId}
      />
    </>
  )
}
