import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysOauthClientListResponse, SysOauthClientRequest } from '@/types'
import { oauthClientApi } from '@/api/modules/oauthClient'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { OAuthClientForm, type OAuthClientFormValues } from './oauth-client-form'
import { getOAuthClientColumns } from './columns'

export default function OAuthClientManagement() {
  const { t } = useTranslation()
  const [searchClientId, setSearchClientId] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<SysOauthClientListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<SysOauthClientListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      clientId: searchClientId || undefined,
    }),
    [searchClientId]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await oauthClientApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback(async (row: SysOauthClientListResponse) => {
    setModalMode('edit')
    setEditingItem(row)
    try {
      const res = await oauthClientApi.getById(row.id)
      setEditingDetail(res.data ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysOauthClientListResponse) => {
      const confirmed = await confirm({
        title: t('oauthClient.confirmDelete', { clientId: row.clientId }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await oauthClientApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: OAuthClientFormValues) => {
    setSubmitting(true)
    try {
      const data: SysOauthClientRequest = {
        clientId: values.clientId,
        clientSecret: values.clientSecret || '',
        scope: values.scope,
        authorizedGrantTypes: values.authorizedGrantTypes,
        webServerRedirectUri: values.webServerRedirectUri || undefined,
        accessTokenValidity: values.accessTokenValidity || undefined,
        refreshTokenValidity: values.refreshTokenValidity || undefined,
        autoapprove: values.autoapprove || undefined,
        tenantId: values.tenantId || undefined,
        userType: values.userType || undefined,
      }
      if (modalMode === 'create') {
        await oauthClientApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItem!.id
        await oauthClientApi.update(editingItem!.id, data)
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
    () => getOAuthClientColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('oauthClient.clientId')}</span>
        <Input
          placeholder={t('oauthClient.searchClientId')}
          value={searchClientId}
          onChange={(e) => setSearchClientId(e.target.value)}
          className="w-48"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('oauthClient.addOAuthClient')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('oauthClient.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('oauthClient.description')}</p>
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
        title={t('oauthClient.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
        width="sm:max-w-lg"
      >
        <OAuthClientForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
