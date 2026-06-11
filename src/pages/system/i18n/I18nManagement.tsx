import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { SysI18nRequest } from '@/types'
import { i18nApi } from '@/api/modules/i18n'
import { DataTable } from '@/components/data-table'
import { FormModal } from '@/components/form-modal'
import { CrudPageLayout } from '@/components/crud-page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCrudPage } from '@/hooks'

import { I18nForm, type I18nFormValues } from './i18n-form'
import { getI18nColumns } from './columns'

export default function I18nManagement() {
  const { t } = useTranslation()
  const [searchCode, setSearchCode] = useState('')
  const [searchLanguage, setSearchLanguage] = useState('')

  const searchParams = useMemo(
    () => ({
      code: searchCode || undefined,
      language: searchLanguage || undefined,
    }),
    [searchCode, searchLanguage]
  )

  const { modal, handlers, tableProps } = useCrudPage({
    api: i18nApi,
    searchParams,
    onFormSubmit: async (values: I18nFormValues, mode) => {
      const data: SysI18nRequest = {
        code: values.code,
        language: values.language,
        content: values.content,
      }
      if (mode === 'create') {
        await i18nApi.create(data)
        toast.success(t('common.createSuccess'))
      } else {
        data.id = modal.editingItem!.id
        await i18nApi.update(modal.editingItem!.id, data)
        toast.success(t('common.editSuccess'))
      }
    },
    confirmDeleteText: (row) => t('i18n.confirmDelete', { code: row.code }),
  })

  const columns = useMemo(
    () => getI18nColumns({ onEdit: handlers.handleEdit, onDelete: handlers.handleDelete }),
    [handlers.handleEdit, handlers.handleDelete]
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
      <Button onClick={handlers.handleCreate}>{t('i18n.addI18n')}</Button>
    </div>
  )

  return (
    <CrudPageLayout
      title={t('i18n.title')}
      description={t('i18n.description')}
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
          title={t('i18n.formTitle')}
          submitting={modal.submitting}
          onConfirm={() => modal.formRef.current?.requestSubmit()}
        >
          <I18nForm
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
