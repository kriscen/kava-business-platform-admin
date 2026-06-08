import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysAreaListResponse, SysAreaRequest } from '@/types'
import { areaApi } from '@/api/modules/area'
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

import { AreaForm, type AreaFormValues } from './area-form'
import { getAreaColumns } from './columns'

export default function AreaManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchAreaType, setSearchAreaType] = useState('')

  const [treeData, setTreeData] = useState<SysAreaListResponse[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<SysAreaListResponse | null>(null)
  const [editingDetail, setEditingDetail] = useState<
    (SysAreaListResponse & Partial<SysAreaListResponse>) | null
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const fetchTree = useCallback(async () => {
    setLoading(true)
    try {
      const res = await areaApi.getTree(searchAreaType ? { areaType: searchAreaType } : undefined)
      let data = res.data ?? []
      if (searchName) {
        function filterTree(nodes: SysAreaListResponse[]): SysAreaListResponse[] {
          return nodes
            .map((n) => {
              const children = n.children ? filterTree(n.children) : []
              if (n.name.includes(searchName) || children.length > 0) {
                return { ...n, children }
              }
              return null
            })
            .filter(Boolean) as SysAreaListResponse[]
        }
        data = filterTree(data)
      }
      setTreeData(data)
    } finally {
      setLoading(false)
    }
  }, [searchName, searchAreaType])

  useEffect(() => {
    fetchTree()
  }, [fetchTree, dataVersion])

  const handleCreate = () => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail(null)
    setModalOpen(true)
  }

  const handleAddChild = useCallback((row: SysAreaListResponse) => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail({
      id: 0,
      pid: row.id,
      name: '',
      adcode: 0,
      areaType: '3',
      areaStatus: '1',
      cityCode: '',
      parentName: row.name,
      children: [],
      gmtCreate: '',
    })
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback(async (row: SysAreaListResponse) => {
    setModalMode('edit')
    setEditingItem(row)
    try {
      const res = await areaApi.getById(row.id)
      setEditingDetail(res.data ?? null)
    } catch {
      setEditingDetail(row)
    }
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysAreaListResponse) => {
      const confirmed = await confirm({
        title: t('area.confirmDelete', { name: row.name }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await areaApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: AreaFormValues) => {
    setSubmitting(true)
    try {
      const data: SysAreaRequest = {
        name: values.name,
        pid: values.pid ?? undefined,
        adcode: values.adcode || undefined,
        areaType: values.areaType || undefined,
        areaStatus: values.areaStatus || undefined,
        cityCode: values.cityCode || undefined,
      }
      if (modalMode === 'create') {
        await areaApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItem!.id
        await areaApi.update(editingItem!.id, data)
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
      getAreaColumns({ onEdit: handleEdit, onDelete: handleDelete, onAddChild: handleAddChild }),
    [handleEdit, handleDelete, handleAddChild]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('area.name')}</span>
        <Input
          placeholder={t('area.searchName')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('area.areaType')}</span>
        <Select
          value={searchAreaType}
          onValueChange={(v) => setSearchAreaType(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('area.areaTypePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('common.all')}</SelectItem>
            <SelectItem value="0">{t('area.areaTypeCountry')}</SelectItem>
            <SelectItem value="1">{t('area.areaTypeProvince')}</SelectItem>
            <SelectItem value="2">{t('area.areaTypeCity')}</SelectItem>
            <SelectItem value="3">{t('area.areaTypeDistrict')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('area.addArea')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('area.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('area.description')}</p>
      </div>

      <TreeTable<SysAreaListResponse>
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
        title={t('area.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <AreaForm
          mode={modalMode}
          initialValues={editingDetail ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
