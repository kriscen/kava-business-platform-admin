import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysAppListResponse, SysAppRequest, SysMenuListResponse } from '@/types'
import { appApi } from '@/api/modules/app'
import { menuApi } from '@/api/modules/menu'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

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

function Toolbar({
  onCreate,
  onBatchDelete,
  count,
  t,
}: {
  onCreate: () => void
  onBatchDelete: () => void
  count: number
  t: (key: string) => string
}) {
  return (
    <div className="flex gap-2">
      <Button onClick={onCreate}>{t('app.addApp')}</Button>
      {count > 0 && (
        <Button variant="destructive" onClick={onBatchDelete}>
          {t('common.batchDelete')} ({count})
        </Button>
      )}
    </div>
  )
}

export default function AppManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [batchDeleteCount, setBatchDeleteCount] = useState(0)

  const searchParams = useMemo(
    () => ({
      appName: searchName || undefined,
    }),
    [searchName]
  )

  const { modal, handlers, tableProps } = useCrudPage<
    SysAppListResponse,
    SysAppListResponse,
    AppFormValues
  >({
    api: appApi,
    searchParams,
    confirmDeleteText: (row) => t('app.confirmDelete', { name: row.name }),
    confirmBatchDeleteText: (count) => t('app.confirmBatchDelete', { count }),
    enableBatchDelete: true,
    onFormSubmit: async (values, mode) => {
      const data: SysAppRequest = {
        code: values.code,
        name: values.name,
        icon: values.icon,
        description: values.description,
      }
      if (mode === 'create') {
        await appApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await appApi.update(data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const mergedTableProps = useMemo(
    () => ({
      ...tableProps,
      onSelectedRowsChange: (rows: SysAppListResponse[]) => {
        setBatchDeleteCount(rows.length)
        tableProps.onSelectedRowsChange?.(rows)
      },
    }),
    [tableProps]
  )

  // Bind menus modal (outside hook scope)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [menuTree, setMenuTree] = useState<SysMenuListResponse[]>([])
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<number>>(new Set())
  const [bindingApp, setBindingApp] = useState<SysAppListResponse | null>(null)
  const [bindingSubmitting, setBindingSubmitting] = useState(false)

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

  const columns = useMemo(
    () =>
      getAppColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
        onBindMenus: handleBindMenus,
      }),
    [handlers.handleEdit, handlers.handleDelete, handleBindMenus]
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
    <Toolbar
      onCreate={handlers.handleCreate}
      onBatchDelete={handlers.handleBatchDelete}
      count={batchDeleteCount}
      t={t}
    />
  )

  return (
    <CrudPageLayout
      title={t('app.title')}
      description={t('app.description')}
      searchSlot={searchSlot}
      toolbarSlot={toolbarSlot}
      table={<DataTable columns={columns} {...mergedTableProps} />}
      formModal={
        <>
          <FormModal
            open={modal.open}
            onOpenChange={handlers.setOpen}
            mode={modal.mode}
            title={t('app.formTitle')}
            submitting={modal.submitting}
            onConfirm={() => modal.formRef.current?.requestSubmit()}
          >
            <AppForm
              mode={modal.mode}
              initialValues={modal.editingDetail ?? undefined}
              onSubmit={handlers.handleFormSubmit}
              formRef={modal.formRef}
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
        </>
      }
    />
  )
}
