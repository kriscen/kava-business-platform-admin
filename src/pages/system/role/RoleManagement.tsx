import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysRoleListResponse, SysRoleRequest } from '@/types'
import { roleApi } from '@/api/modules/role'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { confirm } from '@/components/confirm-dialog'

import { RoleForm, type RoleFormValues } from './role-form'
import { getRoleColumns } from './columns'

export default function RoleManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchCode, setSearchCode] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingRole, setEditingRole] = useState<SysRoleListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<
    (SysRoleListResponse & { menuIds?: number[] }) | null
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      roleName: searchName || undefined,
      roleCode: searchCode || undefined,
    }),
    [searchName, searchCode]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await roleApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingRole(null)
    setEditingDetail(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback(async (row: SysRoleListResponse) => {
    setModalMode('edit')
    setEditingRole(row)
    try {
      const res = await roleApi.getById(row.id)
      setEditingDetail(res.data ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysRoleListResponse) => {
      const confirmed = await confirm({
        title: t('role.confirmDelete', { name: row.roleName }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await roleApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: RoleFormValues) => {
    setSubmitting(true)
    try {
      const data: SysRoleRequest = {
        roleName: values.roleName,
        roleCode: values.roleCode,
        roleDesc: values.roleDesc || undefined,
        dsType: values.dsType || undefined,
        dsScope: values.dsScope || undefined,
        menuIds: values.menuIds,
      }
      if (modalMode === 'create') {
        await roleApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingRole!.id
        await roleApi.update(data)
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
    () => getRoleColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
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
      <Button onClick={handleCreate}>{t('role.addRole')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('role.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('role.description')}</p>
      </div>

      <DataTable
        columns={columns}
        fetchData={fetchData}
        searchSlot={searchSlot}
        toolbarSlot={toolbarSlot}
        refreshKey={dataVersion}
      />

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        title={t('role.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <RoleForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
