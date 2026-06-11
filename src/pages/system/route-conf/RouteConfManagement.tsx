import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysRouteConfRequest } from '@/types'
import { routeConfApi } from '@/api/modules/routeConf'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCrudPage } from '@/hooks'

import { RouteConfForm, type RouteConfFormValues } from './route-conf-form'
import { getRouteConfColumns } from './columns'

export default function RouteConfManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const searchParams = useMemo(
    () => ({
      routeName: searchName || undefined,
    }),
    [searchName]
  )

  const { modal, handlers, tableProps } = useCrudPage({
    api: routeConfApi,
    searchParams,
    onFormSubmit: async (values: RouteConfFormValues, mode) => {
      const data: SysRouteConfRequest = {
        routeId: values.routeId,
        routeName: values.routeName,
        predicates: values.predicates,
        filters: values.filters,
        uri: values.uri,
        sortOrder: values.sortOrder || undefined,
        metadata: values.metadata || undefined,
      }
      if (mode === 'create') {
        await routeConfApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await routeConfApi.update(modal.editingItem!.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
    confirmDeleteText: (row) => t('routeConf.confirmDelete', { name: row.routeName }),
  })

  const columns = useMemo(
    () =>
      getRouteConfColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
      }),
    [handlers.handleEdit, handlers.handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('routeConf.routeName')}</span>
        <Input
          placeholder={t('routeConf.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-48"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('routeConf.addRouteConf')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('routeConf.title')}
      description={t('routeConf.description')}
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
          title={t('routeConf.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
          width="sm:max-w-lg"
        >
          <RouteConfForm
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
