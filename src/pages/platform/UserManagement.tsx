import { useCallback, useMemo, useRef, useState } from 'react'

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

import { UserForm, type UserFormValues } from './users/user-form'
import { getUserColumns } from './users/columns'

export default function PlatformUserManagement() {
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

  const handleDelete = useCallback(async (row: SysUserListResponse) => {
    if (!window.confirm(`确定删除用户 "${row.username}" 吗？`)) return
    try {
      await userApi.remove([row.id])
      toast.success('删除成功')
      setDataVersion((v) => v + 1)
    } catch {
      toast.error('删除失败')
    }
  }, [])

  const handleBatchDelete = async () => {
    if (!selectedRows.length) return
    if (!window.confirm(`确定删除选中的 ${selectedRows.length} 个用户吗？`)) return
    try {
      await userApi.remove(selectedRows.map((r) => r.id))
      toast.success('批量删除成功')
      setSelectedRows([])
      setDataVersion((v) => v + 1)
    } catch {
      toast.error('批量删除失败')
    }
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
        toast.success('新增成功')
      } else {
        data.id = editingUser!.id
        await userApi.update(data)
        toast.success('编辑成功')
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
        <span className="text-xs text-muted-foreground">用户名</span>
        <Input
          placeholder="搜索用户名"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">手机号</span>
        <Input
          placeholder="搜索手机号"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">状态</span>
        <Select
          value={searchLockFlag}
          onValueChange={(v) => setSearchLockFlag(!v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="0">正常</SelectItem>
            <SelectItem value="9">锁定</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>新增用户</Button>
      {selectedRows.length > 0 && (
        <Button variant="destructive" onClick={handleBatchDelete}>
          批量删除 ({selectedRows.length})
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">用户管理</h2>
        <p className="text-sm text-muted-foreground">管理平台用户账号、角色和权限</p>
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
        title="用户"
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
