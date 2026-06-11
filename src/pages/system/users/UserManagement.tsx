import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysUserListResponse, SysUserRequest } from '@/types'
import { userApi } from '@/api/modules/user'
import { useCrudPage } from '@/hooks'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { DataTable } from '@/components/data-table'
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

import { UserForm, type UserFormValues } from './user-form'
import { getUserColumns } from './columns'

export default function PlatformUserManagement() {
  const { t } = useTranslation()
  const [searchUsername, setSearchUsername] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchLockFlag, setSearchLockFlag] = useState('')

  const searchParams = useMemo(
    () => ({
      username: searchUsername || undefined,
      phone: searchPhone || undefined,
      lockFlag: searchLockFlag || undefined,
    }),
    [searchUsername, searchPhone, searchLockFlag]
  )

  const { modal, handlers, tableProps } = useCrudPage<
    SysUserListResponse,
    SysUserListResponse,
    UserFormValues
  >({
    api: userApi,
    searchParams,
    confirmDeleteText: (row) => t('user.confirmDelete', { username: row.username }),
    confirmBatchDeleteText: (count) => t('user.confirmBatchDelete', { count }),
    enableBatchDelete: true,
    onFormSubmit: async (values, mode) => {
      const data: SysUserRequest = {
        username: values.username,
        phone: values.phone,
        email: values.email,
        nickname: values.nickname,
        name: values.name,
        lockFlag: values.lockFlag,
        groupId: values.groupId,
        roleIds: values.roleIds,
        tenantId: values.tenantId,
      }
      if (mode === 'create') {
        data.password = values.password
        await userApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await userApi.update(data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const columns = useMemo(
    () => getUserColumns({ onEdit: handlers.handleEdit, onDelete: handlers.handleDelete }),
    [handlers.handleEdit, handlers.handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('user.username')}</span>
        <Input
          placeholder={t('user.searchUsername')}
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('user.phone')}</span>
        <Input
          placeholder={t('user.searchPhone')}
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('user.status')}</span>
        <Select
          value={searchLockFlag}
          onValueChange={(v) => setSearchLockFlag(!v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('common.all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="0">{t('common.normal')}</SelectItem>
            <SelectItem value="9">{t('common.locked')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handlers.handleCreate}>{t('user.addUser')}</Button>
      <Button variant="destructive" onClick={handlers.handleBatchDelete}>
        {t('user.batchDelete')}
      </Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('user.title')}
      description={t('user.description')}
      searchSlot={searchSlot}
      toolbarSlot={toolbarSlot}
      table={<DataTable columns={columns} {...tableProps} />}
      formModal={
        <FormModal
          open={modal.open}
          onOpenChange={handlers.setOpen}
          mode={modal.mode}
          title={t('user.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <UserForm
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
