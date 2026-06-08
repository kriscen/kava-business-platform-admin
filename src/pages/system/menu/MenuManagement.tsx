import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysMenuListResponse, SysMenuRequest } from '@/types'
import { menuApi } from '@/api/modules/menu'
import { TreeTable } from '@/components/tree-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { MenuForm, type MenuFormValues } from './menu-form'
import { getMenuColumns } from './columns'

export default function MenuManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchMenuType, setSearchMenuType] = useState('')

  const [treeData, setTreeData] = useState<SysMenuListResponse[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<SysMenuListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<
    (SysMenuListResponse & Partial<SysMenuListResponse>) | null
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const fetchTree = useCallback(async () => {
    setLoading(true)
    try {
      const res = await menuApi.getTree()
      let data = res.data ?? []
      if (searchName) {
        function filterTree(nodes: SysMenuListResponse[]): SysMenuListResponse[] {
          return nodes
            .map((n) => {
              const children = n.children ? filterTree(n.children) : []
              if (n.name.includes(searchName) || children.length > 0) {
                return { ...n, children }
              }
              return null
            })
            .filter(Boolean) as SysMenuListResponse[]
        }
        data = filterTree(data)
      }
      if (searchMenuType) {
        function filterByType(nodes: SysMenuListResponse[]): SysMenuListResponse[] {
          return nodes
            .map((n) => {
              const children = n.children ? filterByType(n.children) : []
              if (n.menuType === searchMenuType || children.length > 0) {
                return { ...n, children }
              }
              return null
            })
            .filter(Boolean) as SysMenuListResponse[]
        }
        data = filterByType(data)
      }
      setTreeData(data)
    } finally {
      setLoading(false)
    }
  }, [searchName, searchMenuType])

  useEffect(() => {
    fetchTree()
  }, [fetchTree, dataVersion])

  const handleCreate = () => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail(null)
    setModalOpen(true)
  }

  const handleAddChild = useCallback((row: SysMenuListResponse) => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail({
      id: 0,
      pid: row.id,
      name: '',
      permission: '',
      path: '',
      component: '',
      icon: '',
      sortOrder: 0,
      menuType: '0',
      visible: '0',
      keepAlive: '0',
      embedded: '0',
      parentName: row.name,
      children: [],
    })
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback(async (row: SysMenuListResponse) => {
    setModalMode('edit')
    setEditingItem(row)
    try {
      const res = await menuApi.getById(row.id)
      setEditingDetail(res.data ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysMenuListResponse) => {
      const confirmed = await confirm({
        title: t('menu.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await menuApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: MenuFormValues) => {
    setSubmitting(true)
    try {
      const data: SysMenuRequest = {
        name: values.name,
        permission: values.permission || undefined,
        pid: values.pid ?? undefined,
        path: values.path || undefined,
        component: values.component || undefined,
        icon: values.icon || undefined,
        sortOrder: values.sortOrder || undefined,
        menuType: values.menuType,
        visible: values.visible || undefined,
        keepAlive: values.keepAlive || undefined,
        embedded: values.embedded || undefined,
      }
      if (modalMode === 'create') {
        await menuApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItem!.id
        await menuApi.update(editingItem!.id, data)
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
      getMenuColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onAddChild: handleAddChild,
      }),
    [handleEdit, handleDelete, handleAddChild]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('menu.name')}</span>
        <Input
          placeholder={t('menu.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('menu.menuType')}</span>
        <Select
          value={searchMenuType}
          onValueChange={(v) => setSearchMenuType(v === '__all__' ? '' : (v ?? ''))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('menu.menuType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('common.all')}</SelectItem>
            <SelectItem value="0">{t('menu.menuTypeMenu')}</SelectItem>
            <SelectItem value="1">{t('menu.menuTypeButton')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('menu.addMenu')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('menu.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('menu.description')}</p>
      </div>

      <TreeTable<SysMenuListResponse>
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
        title={t('menu.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <MenuForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
