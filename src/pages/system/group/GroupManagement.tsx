import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysGroupListResponse, SysGroupRequest } from '@/types'
import { groupApi } from '@/api/modules/group'
import { TreeTable } from '@/components/tree-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { GroupForm, type GroupFormValues } from './group-form'
import { getGroupColumns } from './columns'

export default function GroupManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [treeData, setTreeData] = useState<SysGroupListResponse[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<SysGroupListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<SysGroupListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const fetchTree = useCallback(async () => {
    setLoading(true)
    try {
      const res = await groupApi.getTree()
      let data = res.data ?? []
      if (searchName) {
        function filterTree(nodes: SysGroupListResponse[]): SysGroupListResponse[] {
          return nodes
            .map((n) => {
              const children = n.children ? filterTree(n.children) : []
              if (n.name.includes(searchName) || children.length > 0) {
                return { ...n, children }
              }
              return null
            })
            .filter(Boolean) as SysGroupListResponse[]
        }
        data = filterTree(data)
      }
      setTreeData(data)
    } finally {
      setLoading(false)
    }
  }, [searchName])

  useEffect(() => {
    fetchTree()
  }, [fetchTree, dataVersion])

  const handleCreate = () => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail(null)
    setModalOpen(true)
  }

  const handleAddChild = useCallback((row: SysGroupListResponse) => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail({
      id: 0,
      pid: row.id,
      name: '',
      sortOrder: 0,
      parentName: row.name,
      children: [],
      gmtCreate: '',
    })
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback(async (row: SysGroupListResponse) => {
    setModalMode('edit')
    setEditingItem(row)
    try {
      const res = await groupApi.getById(row.id)
      setEditingDetail(res.data ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysGroupListResponse) => {
      const confirmed = await confirm({
        title: t('group.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await groupApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: GroupFormValues) => {
    setSubmitting(true)
    try {
      const data: SysGroupRequest = {
        name: values.name,
        pid: values.pid ?? undefined,
        sortOrder: values.sortOrder ?? 0,
      }
      if (modalMode === 'create') {
        await groupApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItem!.id
        await groupApi.update(editingItem!.id, data)
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
    () =>
      getGroupColumns({ onEdit: handleEdit, onDelete: handleDelete, onAddChild: handleAddChild }),
    [handleEdit, handleDelete, handleAddChild]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('group.name')}</span>
        <Input
          placeholder={t('group.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('group.addGroup')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('group.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('group.description')}</p>
      </div>

      <TreeTable<SysGroupListResponse>
        columns={columns}
        data={treeData}
        searchSlot={searchSlot}
        toolbarSlot={toolbarSlot}
        loading={loading}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        title={t('group.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <GroupForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
          excludeId={modalMode === 'edit' ? editingItem?.id : undefined}
        />
      </FormModal>
    </div>
  )
}
