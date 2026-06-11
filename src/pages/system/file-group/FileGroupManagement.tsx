import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysFileGroupListResponse, SysFileGroupRequest } from '@/types'
import { fileGroupApi } from '@/api/modules/fileGroup'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCrudPage } from '@/hooks'

import { FileGroupForm, type FileGroupFormValues } from './file-group-form'
import { getFileGroupColumns } from './columns'

export default function FileGroupManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const searchParams = useMemo(
    () => ({
      name: searchName || undefined,
    }),
    [searchName]
  )

  const { modal, handlers, tableProps } = useCrudPage<SysFileGroupListResponse>({
    api: fileGroupApi,
    searchParams,
    enableBatchDelete: true,
    confirmDeleteText: (row) => t('fileGroup.confirmDelete', { name: row.name }),
    confirmBatchDeleteText: (count) => t('fileGroup.confirmBatchDelete', { count }),
    onFormSubmit: async (values: FileGroupFormValues, mode) => {
      const data: SysFileGroupRequest = {
        name: values.name,
        pid: values.pid,
        type: values.type,
      }
      if (mode === 'create') {
        await fileGroupApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await fileGroupApi.update(data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const columns = useMemo(
    () => getFileGroupColumns({ onEdit: handlers.handleEdit, onDelete: handlers.handleDelete }),
    [handlers.handleEdit, handlers.handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('fileGroup.name')}</span>
        <Input
          placeholder={t('fileGroup.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-48"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('fileGroup.addGroup')}</Button>
      <Button variant="destructive" onClick={handlers.handleBatchDelete}>
        {t('common.batchDelete')}
      </Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('fileGroup.title')}
      description={t('fileGroup.description')}
      searchSlot={searchSlot}
      toolbarSlot={toolbarSlot}
      table={
        <DataTable
          columns={columns}
          fetchData={tableProps.fetchData}
          refreshKey={tableProps.refreshKey}
          onSelectedRowsChange={tableProps.onSelectedRowsChange}
        />
      }
      formModal={
        <FormModal
          open={modal.open}
          onOpenChange={handlers.setOpen}
          mode={modal.mode}
          title={t('fileGroup.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <FileGroupForm
            mode={modal.mode}
            initialValues={modal.editingItem ?? undefined}
            onSubmit={handlers.handleFormSubmit}
            formRef={modal.formRef}
          />
        </FormModal>
      }
    />
  )
}
