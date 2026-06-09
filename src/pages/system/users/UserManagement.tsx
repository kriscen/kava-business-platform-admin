import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysUserListResponse, SysUserRequest } from '@/types'
import { userApi } from '@/api/modules/user'
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
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { UserForm, type UserFormValues } from './user-form'
import { getUserColumns } from './columns'

export default function PlatformUserManagement() {
  const { t } = useTranslation()
  const [searchUsername, setSearchUsername] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchLockFlag, setSearchLockFlag] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingUser, setEditingUser] = useState<SysUserListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [selectedRows, setSelectedRows] = useState<SysUserListResponse[]>([])
  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      username: searchUsername || undefined,
      phone: searchPhone || undefined,
      lockFlag: searchLockFlag || undefined,
    }),
    [searchUsername, searchPhone, searchLockFlag]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await userApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingUser(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback((row: SysUserListResponse) => {
    setModalMode('edit')
    setEditingUser(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysUserListResponse) => {
      const confirmed = await confirm({
        title: t('user.confirmDelete', { username: row.username }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await userApi.remove([row.id])
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
      title: t('user.confirmBatchDelete', { count: selectedRows.length }),
      variant: 'destructive',
      confirmText: t('common.delete'),
      onConfirm: async () => {
        await userApi.remove(selectedRows.map((r) => r.id))
      },
    })
    if (!confirmed) return
    toast.success(t('common.batchDeleteSuccess'))
    setSelectedRows([])
    setDataVersion((v) => v + 1)
  }

  const handleFormSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    try {
      const data: SysUserRequest = {
        username: values.username,
        phone: values.phone,
        email: values.email,
        nickname: values.nickname,
        name: values.name,
        lockFlag: values.lockFlag,
      }
      if (modalMode === 'create') {
        data.password = values.password
        await userApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingUser!.id
        await userApi.update(data)
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
    () => getUserColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
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
      <Button onClick={handleCreate}>{t('user.addUser')}</Button>
      {selectedRows.length > 0 && (
        <Button variant="destructive" onClick={handleBatchDelete}>
          {t('user.batchDelete')} ({selectedRows.length})
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('user.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('user.description')}</p>
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
        title={t('user.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <UserForm
          mode={modalMode}
          initialValues={editingUser ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
