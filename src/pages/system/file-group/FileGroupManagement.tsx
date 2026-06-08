import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysFileGroupListResponse, SysFileGroupRequest } from '@/types'
import { fileGroupApi } from '@/api/modules/fileGroup'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { FileGroupForm, type FileGroupFormValues } from './file-group-form'
import { getFileGroupColumns } from './columns'

export default function FileGroupManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingRow, setEditingRow] = useState<SysFileGroupListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [selectedRows, setSelectedRows] = useState<SysFileGroupListResponse[]>([])
  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      name: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await fileGroupApi.getPage({ ...params, ...searchParams })
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
    setModalOpen(true)
  }

  const handleEdit = useCallback((row: SysFileGroupListResponse) => {
    setModalMode('edit')
    setEditingRow(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysFileGroupListResponse) => {
      const confirmed = await confirm({
        title: t('fileGroup.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await fileGroupApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleBatchDelete = async () => {
    if (!selectedRows.length) return
    const confirmed = await confirm({
      title: t('fileGroup.confirmBatchDelete', { count: selectedRows.length }),
      variant: 'destructive',
      confirmText: t('common.delete'),
      onConfirm: async () => {
        await fileGroupApi.remove(selectedRows.map((r) => r.id))
      },
    })
    if (!confirmed) return
    toast.success(t('common.batchDeleteSuccess'))
    setSelectedRows([])
    setDataVersion((v) => v + 1)
  }

  const handleFormSubmit = async (values: FileGroupFormValues) => {
    setSubmitting(true)
    try {
      const data: SysFileGroupRequest = {
        name: values.name,
        pid: values.pid,
        type: values.type,
      }
      if (modalMode === 'create') {
        await fileGroupApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingRow!.id
        await fileGroupApi.update(data)
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
    () => getFileGroupColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
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
      <Button onClick={handleCreate}>{t('fileGroup.addGroup')}</Button>
      {selectedRows.length > 0 && (
        <Button variant="destructive" onClick={handleBatchDelete}>
          {t('common.batchDelete')} ({selectedRows.length})
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('fileGroup.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('fileGroup.description')}</p>
      </div>

      <DataTable
        columns={columns}
        fetchData={fetchData}
        searchSlot={searchSlot}
        toolbarSlot={toolbarSlot}
        onSelectedRowsChange={setSelectedRows}
        refreshKey={dataVersion}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        title={t('fileGroup.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <FileGroupForm
          mode={modalMode}
          initialValues={editingRow ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
