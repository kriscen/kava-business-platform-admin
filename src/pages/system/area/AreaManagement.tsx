import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysAreaListResponse, SysAreaRequest } from '@/types'
import { areaApi } from '@/api/modules/area'
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

import { AreaForm, type AreaFormValues } from './area-form'
import { getAreaColumns } from './columns'

export default function AreaManagement() {
  const { t } = useTranslation()
  const [searchName, setSearchName] = useState('')
  const [searchAreaType, setSearchAreaType] = useState('')

  const searchParams = useMemo(() => ({ name: searchName || undefined }), [searchName])

  const getTreeParams = useMemo(
    () => (searchAreaType ? { areaType: searchAreaType } : undefined),
    [searchAreaType]
  )

  const { modal, handlers, treeData, loading } = useTreeCrudPage<
    SysAreaListResponse,
    SysAreaListResponse & Partial<SysAreaListResponse>,
    AreaFormValues
  >({
    api: areaApi,
    searchParams,
    getTreeParams,
    confirmDeleteText: (row) => t('area.confirmDelete', { name: row.name }),
    filterNode: (node, params) => {
      const name = params.name as string | undefined
      return !name || (node.name as string).includes(name)
    },
    onBeforeCreate: (parent) => ({
      id: 0,
      pid: parent.id,
      name: '',
      adcode: 0,
      areaType: '3',
      areaStatus: '1',
      cityCode: '',
      parentName: parent.name as string,
      children: [],
      gmtCreate: '',
    }),
    onFormSubmit: async (values, mode) => {
      const data: SysAreaRequest = {
        name: values.name,
        pid: values.pid ?? undefined,
        adcode: values.adcode || undefined,
        areaType: values.areaType || undefined,
        areaStatus: values.areaStatus || undefined,
        cityCode: values.cityCode || undefined,
      }
      if (mode === 'create') {
        await areaApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await areaApi.update(modal.editingItem!.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
  })

  const columns = useMemo(
    () =>
      getAreaColumns({
        onEdit: handlers.handleEdit,
        onDelete: handlers.handleDelete,
        onAddChild: handlers.handleAddChild,
      }),
    [handlers.handleEdit, handlers.handleDelete, handlers.handleAddChild]
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
      <Button onClick={handlers.handleCreate}>{t('area.addArea')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('area.title')}
      description={t('area.description')}
      table={
        <TreeTable<SysAreaListResponse>
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
          title={t('area.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <AreaForm
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
