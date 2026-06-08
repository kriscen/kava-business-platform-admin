import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SysI18nListResponse, SysI18nRequest } from '@/types'
import { i18nApi } from '@/api/modules/i18n'
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

import { I18nForm, type I18nFormValues } from './i18n-form'
import { getI18nColumns } from './columns'

export default function I18nManagement() {
  const { t } = useTranslation()
  const [searchCode, setSearchCode] = useState('')
  const [searchLanguage, setSearchLanguage] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<SysI18nListResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [dataVersion, setDataVersion] = useState(0)

  const searchParams = useMemo(
    () => ({
      code: searchCode || undefined,
      language: searchLanguage || undefined,
    }),
    [searchCode, searchLanguage]
  )

  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await i18nApi.getPage({ ...params, ...searchParams })
      return {
        records: res.data?.records ?? [],
        total: res.data?.total ?? 0,
      }
    },
    [searchParams]
  )

  const handleCreate = () => {
    setModalMode('create')
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEdit = useCallback((row: SysI18nListResponse) => {
    setModalMode('edit')
    setEditingItem(row)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (row: SysI18nListResponse) => {
      const confirmed = await confirm({
        title: t('i18n.confirmDelete', { code: row.code }),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await i18nApi.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      setDataVersion((v) => v + 1)
    },
    [t]
  )

  const handleFormSubmit = async (values: I18nFormValues) => {
    setSubmitting(true)
    try {
      const data: SysI18nRequest = {
        code: values.code,
        language: values.language,
        content: values.content,
      }
      if (modalMode === 'create') {
        await i18nApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = editingItem!.id
        await i18nApi.update(editingItem!.id, data)
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
    () => getI18nColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  )

  const searchSlot = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('i18n.code')}</span>
        <Input
          placeholder={t('i18n.searchCode')}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">{t('i18n.language')}</span>
        <Select
          value={searchLanguage}
          onValueChange={(v) => setSearchLanguage(v === '__all__' ? '' : (v ?? ''))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('i18n.languagePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('common.all')}</SelectItem>
            <SelectItem value="zh-CN">{t('i18n.langZhCN')}</SelectItem>
            <SelectItem value="en-US">{t('i18n.langEnUS')}</SelectItem>
            <SelectItem value="ja-JP">{t('i18n.langJaJP')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const toolbarSlot = (
    <div className="flex gap-2">
      <Button onClick={handleCreate}>{t('i18n.addI18n')}</Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">{t('i18n.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('i18n.description')}</p>
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
        title={t('i18n.formTitle')}
        submitting={submitting}
        onConfirm={() => formRef.current?.requestSubmit()}
      >
        <I18nForm
          mode={modalMode}
          initialValues={editingItem ?? undefined}
          onSubmit={handleFormSubmit}
          formRef={formRef}
        />
      </FormModal>
    </div>
  )
}
