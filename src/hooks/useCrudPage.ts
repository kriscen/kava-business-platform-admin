import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { confirm } from '@/components/confirm-dialog'
import type { ApiResponse, PagingInfo } from '@/types'

/** API module shape expected by useCrudPage */
export interface CrudApi<TList, TDetail = TList> {
  getPage: (params: Record<string, unknown>) => Promise<ApiResponse<PagingInfo<TList>>>
  getById?: (id: number) => Promise<ApiResponse<TDetail>>
  remove: (ids: number[]) => Promise<ApiResponse<unknown>>
}

export interface CrudPageConfig<TList, TFormValues> {
  api: CrudApi<TList>
  searchParams: Record<string, unknown>
  /** Called on form submit. Receives form values and mode. Page handles API call. */
  onFormSubmit: (values: TFormValues, mode: 'create' | 'edit') => Promise<void>
  /** Generate delete confirmation text for a single row */
  confirmDeleteText: (row: TList) => string
  /** Generate batch delete confirmation text */
  confirmBatchDeleteText?: (count: number) => string
  /** Enable batch delete (default: false) */
  enableBatchDelete?: boolean
}

export interface ModalState<TList, TDetail = TList> {
  open: boolean
  mode: 'create' | 'edit'
  editingItem: TList | null
  editingDetail: TDetail | null
  submitting: boolean
  formRef: React.RefObject<HTMLFormElement | null>
}

export interface CrudHandlers<TList> {
  handleCreate: () => void
  handleEdit: (row: TList) => void
  handleDelete: (row: TList) => Promise<void>
  handleBatchDelete: () => Promise<void>
  handleFormSubmit: (values: unknown) => Promise<void>
  setOpen: (open: boolean) => void
}

export interface CrudTableProps<T> {
  fetchData: (params: {
    pageNo: number
    pageSize: number
  }) => Promise<{ records: T[]; total: number }>
  refreshKey: number
  onSelectedRowsChange?: (rows: T[]) => void
}

export interface CrudPageReturn<TList, TDetail = TList> {
  modal: ModalState<TList, TDetail>
  handlers: CrudHandlers<TList>
  refresh: () => void
  tableProps: CrudTableProps<TList>
}

export function useCrudPage<TList extends { id: number }, TDetail = TList, TFormValues = unknown>(
  config: CrudPageConfig<TList, TFormValues>
): CrudPageReturn<TList, TDetail> {
  const { t } = useTranslation()
  const {
    api,
    searchParams,
    onFormSubmit,
    confirmDeleteText,
    confirmBatchDeleteText,
    enableBatchDelete = false,
  } = config

  // Data version for triggering refetch
  const [dataVersion, setDataVersion] = useState(0)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<TList | null>(null)
  const [editingDetail, setEditingDetail] = useState<TDetail | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  // Batch delete state
  const [selectedRows, setSelectedRows] = useState<TList[]>([])

  // fetchData for DataTable — merges searchParams with pagination.
  // searchParams is a dependency so DataTable auto-refetches when search changes.
  const fetchData = useCallback(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await api.getPage({ ...searchParams, ...params })
      return {
        records: (res.data?.records ?? []) as TList[],
        total: res.data?.total ?? 0,
      }
    },
    [api, searchParams]
  )

  const refresh = useCallback(() => {
    setDataVersion((v) => v + 1)
  }, [])

  // Handlers
  const handleCreate = useCallback(() => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail(null)
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback(
    async (row: TList) => {
      setModalMode('edit')
      setEditingItem(row)
      if (api.getById) {
        try {
          const res = await api.getById(row.id)
          setEditingDetail((res.data ?? null) as TDetail | null)
        } catch {
          setEditingDetail(row as unknown as TDetail)
        }
      } else {
        setEditingDetail(row as unknown as TDetail)
      }
      setModalOpen(true)
    },
    [api]
  )

  const handleDelete = useCallback(
    async (row: TList) => {
      const confirmed = await confirm({
        title: confirmDeleteText(row),
        variant: 'destructive',
        confirmText: t('common.delete'),
        onConfirm: async () => {
          await api.remove([row.id])
        },
      })
      if (!confirmed) return
      toast.success(t('common.deleteSuccess'))
      refresh()
    },
    [api, confirmDeleteText, refresh, t]
  )

  const handleBatchDelete = useCallback(async () => {
    if (!selectedRows.length) return
    const textFn =
      confirmBatchDeleteText ?? ((count: number) => t('common.confirmBatchDelete', { count }))
    const confirmed = await confirm({
      title: textFn(selectedRows.length),
      variant: 'destructive',
      confirmText: t('common.delete'),
      onConfirm: async () => {
        await api.remove(selectedRows.map((r) => r.id))
      },
    })
    if (!confirmed) return
    toast.success(t('common.batchDeleteSuccess'))
    setSelectedRows([])
    refresh()
  }, [api, confirmBatchDeleteText, refresh, selectedRows, t])

  const handleFormSubmit = useCallback(
    async (values: unknown) => {
      setSubmitting(true)
      try {
        await onFormSubmit(values as TFormValues, modalMode)
        setModalOpen(false)
        refresh()
      } catch {
        // error toast handled by interceptor
      } finally {
        setSubmitting(false)
      }
    },
    [modalMode, onFormSubmit, refresh]
  )

  const modal: ModalState<TList, TDetail> = useMemo(
    () => ({
      open: modalOpen,
      mode: modalMode,
      editingItem,
      editingDetail,
      submitting,
      formRef,
    }),
    [modalOpen, modalMode, editingItem, editingDetail, submitting, formRef]
  )

  const handlers: CrudHandlers<TList> = useMemo(
    () => ({
      handleCreate,
      handleEdit,
      handleDelete,
      handleBatchDelete,
      handleFormSubmit,
      setOpen: setModalOpen,
    }),
    [handleCreate, handleEdit, handleDelete, handleBatchDelete, handleFormSubmit]
  )

  const tableProps: CrudTableProps<TList> = useMemo(
    () => ({
      fetchData,
      refreshKey: dataVersion,
      ...(enableBatchDelete ? { onSelectedRowsChange: setSelectedRows } : {}),
    }),
    [fetchData, dataVersion, enableBatchDelete]
  )

  return { modal, handlers, refresh, tableProps }
}
