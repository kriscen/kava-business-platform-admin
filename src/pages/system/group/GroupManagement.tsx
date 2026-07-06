import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysGroupDetailResponse, SysGroupListResponse, SysGroupRequest } from '@/types'
import { groupApi } from '@/api/modules/group'
import { useTreeCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { TreeTable } from '@/components/tree-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { GroupForm, type GroupFormValues } from './group-form'
import { getGroupColumns } from './columns'

export default function GroupManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')

  const searchParams = useMemo(() => ({ name: searchName || undefined }), [searchName])

  const { modal, handlers, treeData, loading } = useTreeCrudPage<
    SysGroupListResponse,
    SysGroupDetailResponse & { children?: SysGroupListResponse[] },
    GroupFormValues
  >({
    api: groupApi,
    searchParams,
    confirmDeleteText: (row) => t('group.confirmDelete', { name: row.name }),
    filterNode: (node, params) => {
      const name = params.name as string | undefined
      return !name || (node.name as string).includes(name)
    },
    onBeforeCreate: (parent) => ({
      id: 0,
      pid: parent.id,
      name: '',
      sortOrder: 0,
      parentName: parent.name as string,
      children: [],
      gmtCreate: '',
    }),
    onFormSubmit: async (values, mode) => {
      const data: SysGroupRequest = {
        name: values.name,
        pid: values.pid ?? undefined,
        sortOrder: values.sortOrder ?? 0,
      }
      if (mode === 'create') {
        await groupApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await groupApi.update(modal.editingItem!.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const columns = useMemo(
    () =>
      getGroupColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
        onAddChild: handlers.handleAddChild,
      }),
    [handlers.handleEdit, handlers.handleDelete, handlers.handleAddChild]
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
      <Button onClick={handlers.handleCreate}>{t('group.addGroup')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('group.title')}
      description={t('group.description')}
      table={
        <TreeTable<SysGroupListResponse>
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
          title={t('group.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <GroupForm
            mode={modal.mode}
            initialValues={modal.editingDetail ?? undefined}
            onSubmit={handlers.handleFormSubmit}
            formRef={modal.formRef}
            excludeId={modal.mode === 'edit' ? modal.editingItem?.id : undefined}
          />
        </FormModal>
      }
    />
  )
}
