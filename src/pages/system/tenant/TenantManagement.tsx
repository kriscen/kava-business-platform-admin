import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysTenantListResponse, SysTenantRequest } from '@/types'
import { tenantApi } from '@/api/modules/tenant'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { TenantForm, type TenantFormValues } from './tenant-form'
import { getTenantColumns } from './columns'

export default function TenantManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [searchStatus, setSearchStatus] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingTenant, setEditingTenant] = useState<SysTenantListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      name: searchName || undefined,
      code: searchCode || undefined,
      status: searchStatus || undefined,
    }),
    [searchName, searchCode, searchStatus]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await tenantApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingTenant(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback((row: SysTenantListResponse) => {
    setModalMode('edit')
    setEditingTenant(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysTenantListResponse) => {
      const confirmed = await confirm({
        title: t('tenant.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await tenantApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

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
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: TenantFormValues) => {
    setSubmitting(true)
    try {
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
      if (modalMode === 'create') {
        data.adminUsername = values.adminUsername
        data.adminPassword = values.adminPassword
        await tenantApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingTenant!.id
        await tenantApi.update(data.id, data)
        toast.success(t('common.editSuccess'))
      }
      setModalOpen(false)
      setDataVersion((v) => v + 1)
    } catch {
      // error toast handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const columns = useMemo(
    () =>
      getTenantColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    [handleEdit, handleDelete, handleToggleStatus]
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
      <Button onClick={handleCreate}>{t('tenant.addTenant')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('tenant.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('tenant.description')}</p>
      </div>

      <DataTable
        columns={columns}
        fetchData={fetchData}
        searchSlot={searchSlot}
        toolbarSlot={toolbarSlot}
        refreshKey={dataVersion}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        title={t('tenant.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <TenantForm
          mode={modalMode}
          initialValues={editingTenant ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
