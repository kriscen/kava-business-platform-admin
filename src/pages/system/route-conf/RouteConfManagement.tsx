import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysRouteConfListResponse, SysRouteConfRequest } from '@/types'
import { routeConfApi } from '@/api/modules/routeConf'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { RouteConfForm, type RouteConfFormValues } from './route-conf-form'
import { getRouteConfColumns } from './columns'

export default function RouteConfManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<SysRouteConfListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<SysRouteConfListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      routeName: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await routeConfApi.getPage({ ...params, ...searchParams })
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

  const handleEdit = useCallback(async (row: SysRouteConfListResponse) => {
    setModalMode('edit')
    setEditingItem(row)
    try {
      const res = await routeConfApi.getById(row.id)
      setEditingDetail(res.data ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysRouteConfListResponse) => {
      const confirmed = await confirm({
        title: t('routeConf.confirmDelete', { name: row.routeName }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await routeConfApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: RouteConfFormValues) => {
    setSubmitting(true)
    try {
      const data: SysRouteConfRequest = {
        routeId: values.routeId,
        routeName: values.routeName,
        predicates: values.predicates,
        filters: values.filters,
        uri: values.uri,
        sortOrder: values.sortOrder || undefined,
        metadata: values.metadata || undefined,
      }
      if (modalMode === 'create') {
        await routeConfApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItem!.id
        await routeConfApi.update(editingItem!.id, data)
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
    () => getRouteConfColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
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
      <Button onClick={handleCreate}>{t('routeConf.addRouteConf')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('routeConf.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('routeConf.description')}</p>
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
        title={t('routeConf.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
        width="sm:max-w-lg"
      >
        <RouteConfForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
