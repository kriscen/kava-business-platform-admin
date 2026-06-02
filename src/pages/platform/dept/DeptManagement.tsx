import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysDeptListResponse, SysDeptRequest } from '@/types'
import { deptApi } from '@/api/modules/dept'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { DeptForm, type DeptFormValues } from './dept-form'
import { getDeptColumns } from './columns'

export default function DeptManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingDept, setEditingDept] = useState<SysDeptListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      name: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await deptApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingDept(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback((row: SysDeptListResponse) => {
    setModalMode('edit')
    setEditingDept(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysDeptListResponse) => {
      const confirmed = await confirm({
        title: t('dept.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await deptApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: DeptFormValues) => {
    setSubmitting(true)
    try {
      const data: SysDeptRequest = {
        name: values.name,
        pid: values.pid ?? undefined,
        sortOrder: values.sortOrder,
      }
      if (modalMode === 'create') {
        await deptApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingDept!.id
        await deptApi.update(editingDept!.id, data)
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
    () => getDeptColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('dept.name')}</span>
        <Input
          placeholder={t('dept.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('dept.addDept')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('dept.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('dept.description')}</p>
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
        title={t('dept.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <DeptForm
          mode={modalMode}
          initialValues={editingDept ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
