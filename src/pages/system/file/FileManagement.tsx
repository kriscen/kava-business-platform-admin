import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysFileListResponse, SysFileRequest } from '@/types'
import { fileApi } from '@/api/modules/file'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { FileForm, type FileFormValues } from './file-form'
import { getFileColumns } from './columns'

export default function FileManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const searchParams = useMemo(
    () => ({
      fileName: searchName || undefined,
    }),
    [searchName]
  )

  // Ref to avoid stale closure in onFormSubmit (modal.editingItem updates via hook state)
  const editingItemRef = useRef<SysFileListResponse | null>(null)

  const onFormSubmit = useCallback(
    async (values: FileFormValues, mode: 'create' | 'edit') => {
      const data: SysFileRequest = {
        fileName: values.fileName,
        original: values.original,
        bucketName: values.bucketName,
        dir: values.dir,
        type: values.type,
        groupId: values.groupId,
        fileSize: values.fileSize,
      }
      if (mode === 'create') {
        await fileApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItemRef.current!.id
        await fileApi.update(data)
        toast.success(t('common.editSuccess'))
      }
    },
    [t]
  )

  const { modal, handlers, tableProps } = useCrudPage<SysFileListResponse>({
    api: fileApi,
    searchParams,
    onFormSubmit,
    confirmDeleteText: (row) => t('file.confirmDelete', { name: row.fileName }),
  })

  // Sync editingItem ref with hook state
  useEffect(() => {
    editingItemRef.current = modal.editingItem
  }, [modal.editingItem])

  const columns = useMemo(
    () => getFileColumns({ onEdit: handlers.handleEdit, onDelete: handlers.handleDelete }),
    [handlers.handleEdit, handlers.handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('file.fileName')}</span>
        <Input
          placeholder={t('file.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-48"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('file.addFile')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('file.title')}
      description={t('file.description')}
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
          title={t('file.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <FileForm
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
