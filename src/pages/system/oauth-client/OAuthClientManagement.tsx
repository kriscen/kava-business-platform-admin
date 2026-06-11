import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysOauthClientListResponse, SysOauthClientRequest } from '@/types'
import { oauthClientApi } from '@/api/modules/oauthClient'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { OAuthClientForm, type OAuthClientFormValues } from './oauth-client-form'
import { getOAuthClientColumns } from './columns'

export default function OAuthClientManagement() {
  const { t } = useTranslation()
  const [searchClientId, setSearchClientId] = useState('')

  const searchParams = useMemo(
    () => ({
      clientId: searchClientId || undefined,
    }),
    [searchClientId]
  )

  // Ref to avoid stale closure in onFormSubmit (modal.editingItem updates via hook state)
  const editingItemRef = useRef<SysOauthClientListResponse | null>(null)

  const onFormSubmit = useCallback(
    async (values: OAuthClientFormValues, mode: 'create' | 'edit') => {
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
      if (mode === 'create') {
        await oauthClientApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItemRef.current!.id
        await oauthClientApi.update(editingItemRef.current!.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
    [t]
  )

  const { modal, handlers, tableProps } = useCrudPage<SysOauthClientListResponse>({
    api: oauthClientApi,
    searchParams,
    onFormSubmit,
    confirmDeleteText: (row) => t('oauthClient.confirmDelete', { clientId: row.clientId }),
  })

  // Sync editingItem ref with hook state
  useEffect(() => {
    editingItemRef.current = modal.editingItem
  }, [modal.editingItem])

  const columns = useMemo(
    () => getOAuthClientColumns({ onEdit: handlers.handleEdit, onDelete: handlers.handleDelete }),
    [handlers.handleEdit, handlers.handleDelete]
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
      <Button onClick={handlers.handleCreate}>{t('oauthClient.addOAuthClient')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('oauthClient.title')}
      description={t('oauthClient.description')}
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
          title={t('oauthClient.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
          width="sm:max-w-lg"
        >
          <OAuthClientForm
            mode={modal.mode}
            initialValues={modal.editingDetail ?? undefined}
            onSubmit={handlers.handleFormSubmit}
            formRef={modal.formRef}
          />
        </FormModal>
      }
    />
  )
}
