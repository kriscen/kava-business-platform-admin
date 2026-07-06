import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysMenuDetailResponse, SysMenuListResponse, SysMenuRequest } from '@/types'
import { menuApi } from '@/api/modules/menu'
import { useTreeCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
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

import { MenuForm, type MenuFormValues } from './menu-form'
import { getMenuColumns } from './columns'

export default function MenuManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchMenuType, setSearchMenuType] = useState('')

  const searchParams = useMemo(
    () => ({
      name: searchName || undefined,
      menuType: searchMenuType || undefined,
    }),
    [searchName, searchMenuType]
  )

  const { modal, handlers, treeData, loading } = useTreeCrudPage<
    SysMenuListResponse,
    SysMenuDetailResponse & { children?: SysMenuListResponse[] },
    MenuFormValues
  >({
    api: menuApi,
    searchParams,
    confirmDeleteText: (row) => t('menu.confirmDelete', { name: row.name }),
    filterNode: (node, params) => {
      const name = params.name as string | undefined
      const menuType = params.menuType as string | undefined
      const nameMatch = !name || (node.name as string).includes(name)
      const typeMatch = !menuType || node.menuType === menuType
      return nameMatch && typeMatch
    },
    onBeforeCreate: (parent) => ({
      id: 0,
      pid: parent.id,
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
      parentName: parent.name as string,
      children: [],
    }),
    onFormSubmit: async (values, mode) => {
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
      if (mode === 'create') {
        await menuApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await menuApi.update(modal.editingItem!.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const columns = useMemo(
    () =>
      getMenuColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
        onAddChild: handlers.handleAddChild,
      }),
    [handlers.handleEdit, handlers.handleDelete, handlers.handleAddChild]
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
      <Button onClick={handlers.handleCreate}>{t('menu.addMenu')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('menu.title')}
      description={t('menu.description')}
      table={
        <TreeTable<SysMenuListResponse>
          columns={columns}
          data={treeData}
          searchSlot={searchSlot}
          toolbarSlot={toolbarSlot}
          loading={loading}
        />
      }
      formModal={
        <FormModal
          open={modal.open}
          onOpenChange={handlers.setOpen}
          mode={modal.mode}
          title={t('menu.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <MenuForm
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
