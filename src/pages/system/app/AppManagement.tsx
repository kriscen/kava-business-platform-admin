import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysAppListResponse, SysAppRequest, SysMenuListResponse } from '@/types'
import { appApi } from '@/api/modules/app'
import { menuApi } from '@/api/modules/menu'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { AppForm, type AppFormValues } from './app-form'
import { getAppColumns } from './columns'

function MenuTreeNode({
  menu,
  selectedIds,
  onToggle,
  depth = 0,
}: {
  menu: SysMenuListResponse
  selectedIds: Set<number>
  onToggle: (id: number) => void
  depth?: number
}) {
  const hasChildren = menu.children && menu.children.length > 0
  return (
    <div>
      <div className="flex items-center gap-2 py-1" style={{ paddingLeft: `${depth * 20}px` }}>
        <Checkbox checked={selectedIds.has(menu.id)} onCheckedChange={() => onToggle(menu.id)} />
        <span className="text-sm">{menu.name}</span>
      </div>
      {hasChildren &&
        menu.children.map((child) => (
          <MenuTreeNode
            key={child.id}
            menu={child}
            selectedIds={selectedIds}
            onToggle={onToggle}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}

export default function AppManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingRow, setEditingRow] = useState<SysAppListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<SysAppListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [menuTree, setMenuTree] = useState<SysMenuListResponse[]>([])
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<number>>(new Set())
  const [bindingApp, setBindingApp] = useState<SysAppListResponse | null>(null)
  const [bindingSubmitting, setBindingSubmitting] = useState(false)

  const [selectedRows, setSelectedRows] = useState<SysAppListResponse[]>([])
  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      appName: searchName || undefined,
    }),
    [searchName]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await appApi.getPage({ ...params, ...searchParams })
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

  const handleEdit = useCallback(async (row: SysAppListResponse) => {
    setModalMode('edit')
    setEditingRow(row)
    try {
      const res = await appApi.getById(row.id)
      setEditingDetail((res.data as SysAppListResponse) ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysAppListResponse) => {
      const confirmed = await confirm({
        title: t('app.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await appApi.remove([row.id])
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
      title: t('app.confirmBatchDelete', { count: selectedRows.length }),
      variant: 'destructive',
      confirmText: t('common.delete'),
      onConfirm: async () => {
        await appApi.remove(selectedRows.map((r) => r.id))
      },
    })
    if (!confirmed) return
    toast.success(t('common.batchDeleteSuccess'))
    setSelectedRows([])
    setDataVersion((v) => v + 1)
  }

  const handleBindMenus = useCallback(async (row: SysAppListResponse) => {
    setBindingApp(row)
    try {
      const [treeRes, detailRes] = await Promise.all([menuApi.getTree(), appApi.getById(row.id)])
      setMenuTree(treeRes.data ?? [])
      setSelectedMenuIds(new Set((detailRes.data as { menuIds?: number[] })?.menuIds ?? []))
    } catch {
      setMenuTree([])
      setSelectedMenuIds(new Set())
    }
    setMenuModalOpen(true)
  }, [])

  const handleMenuToggle = useCallback((id: number) => {
    setSelectedMenuIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleBindSubmit = async () => {
    if (!bindingApp) return
    setBindingSubmitting(true)
    try {
      await appApi.bindMenus(bindingApp.id, Array.from(selectedMenuIds))
      toast.success(t('app.bindSuccess'))
      setMenuModalOpen(false)
    } catch {
      // error toast handled by interceptor
    } finally {
      setBindingSubmitting(false)
    }
  }

  const handleFormSubmit = async (values: AppFormValues) => {
    setSubmitting(true)
    try {
      const data: SysAppRequest = {
        code: values.code,
        name: values.name,
        icon: values.icon,
        description: values.description,
      }
      if (modalMode === 'create') {
        await appApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingRow!.id
        await appApi.update(data)
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
      getAppColumns({ onEdit: handleEdit, onDelete: handleDelete, onBindMenus: handleBindMenus }),
    [handleEdit, handleDelete, handleBindMenus]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('app.name')}</span>
        <Input
          placeholder={t('app.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-48"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('app.addApp')}</Button>
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
        <h2 className="text-lg font-semibold">{t('app.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('app.description')}</p>
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
        title={t('app.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <AppForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>

      <FormModal
        open={menuModalOpen}
        onOpenChange={setMenuModalOpen}
        mode="edit"
        title={`${t('app.bindMenusTitle')} - ${bindingApp?.name ?? ''}`}
        submitting={bindingSubmitting}
        onConfirm={handleBindSubmit}
        width="sm:max-w-md"
      >
        <div className="max-h-80 overflow-auto">
          {menuTree.length > 0 ? (
            menuTree.map((menu) => (
              <MenuTreeNode
                key={menu.id}
                menu={menu}
                selectedIds={selectedMenuIds}
                onToggle={handleMenuToggle}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
          )}
        </div>
      </FormModal>
    </div>
  )
}
