import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysPublicParamRequest } from '@/types'
import { publicParamApi } from '@/api/modules/publicParam'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { PublicParamForm, type PublicParamFormValues } from './public-param-form'
import { getPublicParamColumns } from './columns'

export default function PublicParamManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const searchParams = useMemo(
    () => ({
      publicName: searchName || undefined,
    }),
    [searchName]
  )

  const onFormSubmit = async (values: PublicParamFormValues, mode: 'create' | 'edit') => {
    const data: SysPublicParamRequest = {
      publicName: values.publicName,
      publicKey: values.publicKey,
      publicValue: values.publicValue,
      status: values.status,
      publicType: values.publicType,
      systemFlag: values.systemFlag,
      remark: values.remark,
    }
    if (mode === 'create') {
      await publicParamApi.create(data)
      toast.success(t('common.createSuccess'))
    } else {
      data.id = modal.editingItem!.id
      await publicParamApi.update(modal.editingItem!.id, data)
      toast.success(t('common.editSuccess'))
    }
  }

  const { modal, handlers, tableProps } = useCrudPage({
    api: publicParamApi,
    searchParams,
    onFormSubmit,
    confirmDeleteText: (row) => t('publicParam.confirmDelete', { publicName: row.publicName }),
  })

  const columns = useMemo(
    () =>
      getPublicParamColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
      }),
    [handlers.handleEdit, handlers.handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('publicParam.publicName')}</span>
        <Input
          placeholder={t('publicParam.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('publicParam.addParam')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('publicParam.title')}
      description={t('publicParam.description')}
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
          title={t('publicParam.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <PublicParamForm
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
