import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysPublicParamListResponse, SysPublicParamRequest } from '@/types'
import { publicParamApi } from '@/api/modules/publicParam'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { PublicParamForm, type PublicParamFormValues } from './public-param-form'
import { getPublicParamColumns } from './columns'

export default function PublicParamManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingParam, setEditingParam] = useState<SysPublicParamListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      publicName: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await publicParamApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingParam(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback((row: SysPublicParamListResponse) => {
    setModalMode('edit')
    setEditingParam(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysPublicParamListResponse) => {
      const confirmed = await confirm({
        title: t('publicParam.confirmDelete', { publicName: row.publicName }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await publicParamApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: PublicParamFormValues) => {
    setSubmitting(true)
    try {
      const data: SysPublicParamRequest = {
        publicName: values.publicName,
        publicKey: values.publicKey,
        publicValue: values.publicValue,
        status: values.status,
        publicType: values.publicType,
        systemFlag: values.systemFlag,
        remark: values.remark,
      }
      if (modalMode === 'create') {
        await publicParamApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingParam!.id
        await publicParamApi.update(editingParam!.id, data)
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
    () => getPublicParamColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
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
      <Button onClick={handleCreate}>{t('publicParam.addParam')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('publicParam.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('publicParam.description')}</p>
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
        title={t('publicParam.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <PublicParamForm
          mode={modalMode}
          initialValues={editingParam ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
