import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysFileListResponse, SysFileRequest } from '@/types'
import { fileApi } from '@/api/modules/file'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { FileForm, type FileFormValues } from './file-form'
import { getFileColumns } from './columns'

export default function FileManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingRow, setEditingRow] = useState<SysFileListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<SysFileListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      fileName: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await fileApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingRow(null)
    setEditingDetail(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback(async (row: SysFileListResponse) => {
    setModalMode('edit')
    setEditingRow(row)
    try {
      const res = await fileApi.getById(row.id)
      setEditingDetail((res.data as SysFileListResponse) ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysFileListResponse) => {
      const confirmed = await confirm({
        title: t('file.confirmDelete', { name: row.fileName }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await fileApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: FileFormValues) => {
    setSubmitting(true)
    try {
      const data: SysFileRequest = {
        fileName: values.fileName,
        original: values.original,
        bucketName: values.bucketName,
        dir: values.dir,
        type: values.type,
        groupId: values.groupId,
        fileSize: values.fileSize,
      }
      if (modalMode === 'create') {
        await fileApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingRow!.id
        await fileApi.update(data)
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
    () => getFileColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
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
      <Button onClick={handleCreate}>{t('file.addFile')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('file.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('file.description')}</p>
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
        title={t('file.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <FileForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
