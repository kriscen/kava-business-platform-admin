import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysRoleRequest } from '@/types'
import { roleApi } from '@/api/modules/role'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { RoleForm, type RoleFormValues } from './role-form'
import { getRoleColumns } from './columns'

export default function RoleManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchCode, setSearchCode] = useState('')

  const searchParams = useMemo(
    () => ({
      roleName: searchName || undefined,
      roleCode: searchCode || undefined,
    }),
    [searchName, searchCode]
  )

  const onFormSubmit = async (values: RoleFormValues, mode: 'create' | 'edit') => {
    const data: SysRoleRequest = {
      roleName: values.roleName,
      roleCode: values.roleCode,
      roleDesc: values.roleDesc || undefined,
      dsType: values.dsType || undefined,
      dsScope: values.dsScope || undefined,
      menuIds: values.menuIds,
    }
    if (mode === 'create') {
      await roleApi.create(data)
      toast.success(t('common.createSuccess'))
    } else {
      data.id = modal.editingItem!.id
      await roleApi.update(data)
      toast.success(t('common.editSuccess'))
    }
  }

  const { modal, handlers, tableProps } = useCrudPage({
    api: roleApi,
    searchParams,
    onFormSubmit,
    confirmDeleteText: (row) => t('role.confirmDelete', { name: row.roleName }),
  })

  const columns = useMemo(
    () => getRoleColumns({ onEdit: handlers.handleEdit, onDelete: handlers.handleDelete }),
    [handlers.handleEdit, handlers.handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('role.roleName')}</span>
        <Input
          placeholder={t('role.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('role.roleCode')}</span>
        <Input
          placeholder={t('role.searchCode')}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('role.addRole')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('role.title')}
      description={t('role.description')}
      searchSlot={searchSlot}
      toolbarSlot={toolbarSlot}
      table={
        <DataTable
          columns={columns}
          fetchData={tableProps.fetchData}
          refreshKey={tableProps.refreshKey}
        />
      }
      formModal={
        <FormModal
          open={modal.open}
          onOpenChange={handlers.setOpen}
          mode={modal.mode}
          title={t('role.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <RoleForm
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
