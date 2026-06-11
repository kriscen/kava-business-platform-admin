import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { confirm } from '@/components/confirm-dialog'
import type { ApiResponse } from '@/types'
import type { CrudApi, ModalState, CrudHandlers } from './useCrudPage'

export interface TreeCrudApi<TList, TDetail = TList> extends CrudApi<TList, TDetail> {
  getTree: (params?: Record<string, unknown>) => Promise<ApiResponse<TList[]>>
}

export interface TreeCrudPageConfig<TList, TDetail, TFormValues> {
  api: TreeCrudApi<TList>
  searchParams: Record<string, unknown>
  onFormSubmit: (values: TFormValues, mode: 'create' | 'edit') => Promise<void>
  confirmDeleteText: (row: TList) => string
  /** Frontend filter function for tree data. Return true to keep a node. */
  filterNode?: (node: TList, searchParams: Record<string, unknown>) => boolean
  /** API-level params passed to getTree (e.g. areaType for server-side filtering) */
  getTreeParams?: Record<string, unknown>
  /** Called when creating a child node. Receives the parent row. Return initial detail values. */
  onBeforeCreate?: (parentRow: TList) => TDetail
  /** Enable batch delete (default: false) */
  enableBatchDelete?: boolean
  /** Generate batch delete confirmation text */
  confirmBatchDeleteText?: (count: number) => string
}

export interface TreeCrudPageReturn<TList, TDetail = TList> {
  modal: ModalState<TList, TDetail>
  handlers: CrudHandlers<TList> & {
    handleAddChild: (row: TList) => void
  }
  refresh: () => void
  treeData: TList[]
  loading: boolean
  onSelectedRowsChange?: (rows: TList[]) => void
}

/** Recursively filter tree, keeping ancestors of matching nodes */
function filterTree<T extends Record<string, unknown>>(
  nodes: T[],
  predicate: (node: T) => boolean,
  childrenField = 'children'
): T[] {
  return nodes
    .map((node) => {
      const children = (node[childrenField] as T[] | undefined) ?? []
      const filteredChildren = filterTree(children, predicate, childrenField)
      if (predicate(node) || filteredChildren.length > 0) {
        return { ...node, [childrenField]: filteredChildren }
      }
      return null
    })
    .filter(Boolean) as T[]
}

export function useTreeCrudPage<
  TList extends { id: number } & Record<string, unknown>,
  TDetail = TList,
  TFormValues = unknown,
>(config: TreeCrudPageConfig<TList, TDetail, TFormValues>): TreeCrudPageReturn<TList, TDetail> {
  const { t } = useTranslation()
  const {
    api,
    searchParams,
    onFormSubmit,
    confirmDeleteText,
    filterNode,
    getTreeParams,
    onBeforeCreate,
    enableBatchDelete = false,
    confirmBatchDeleteText,
  } = config

  const [treeData, setTreeData] = useState<TList[]>([])
  const [loading, setLoading] = useState(true)
  const [dataVersion, setDataVersion] = useState(0)
  const [selectedRows, setSelectedRows] = useState<TList[]>([])

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<TList | null>(null)
  const [editingDetail, setEditingDetail] = useState<TDetail | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  // Stable refs for values that should NOT trigger re-fetch on their own
  const getTreeParamsRef = useRef(getTreeParams)
  getTreeParamsRef.current = getTreeParams
  const filterNodeRef = useRef(filterNode)
  filterNodeRef.current = filterNode
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  // Bump dataVersion when searchParams or getTreeParams change
  const prevSearchParamsRef = useRef(searchParams)
  const prevGetTreeParamsRef = useRef(getTreeParams)
  useEffect(() => {
    const paramsChanged =
      prevSearchParamsRef.current !== searchParams || prevGetTreeParamsRef.current !== getTreeParams
    prevSearchParamsRef.current = searchParams
    prevGetTreeParamsRef.current = getTreeParams
    if (paramsChanged) {
      setDataVersion((v) => v + 1)
    }
  }, [searchParams, getTreeParams])

  // Fetch tree data — only re-fetches when api or dataVersion changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getTree(getTreeParamsRef.current)
      .then((res) => {
        if (cancelled) return
        let data = (res.data ?? []) as TList[]
        const sp = searchParamsRef.current
        const fn = filterNodeRef.current
        if (fn && Object.values(sp).some((v) => v != null && v !== '')) {
          data = filterTree(data, (node) => fn(node, sp)) as TList[]
        }
        setTreeData(data)
      })
      .catch(() => {
        if (cancelled) return
        setTreeData([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [api, dataVersion])

  const refresh = useCallback(() => {
    setDataVersion((v) => v + 1)
  }, [])

  const handleCreate = useCallback(() => {
    setModalMode('create')
    setEditingItem(null)
    setEditingDetail(null)
    setModalOpen(true)
  }, [])

  const handleAddChild = useCallback(
    (row: TList) => {
      setModalMode('create')
      setEditingItem(null)
      if (onBeforeCreate) {
        setEditingDetail(onBeforeCreate(row))
      } else {
        setEditingDetail(null)
      }
      setModalOpen(true)
    },
    [onBeforeCreate]
  )

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
    [modalOpen, modalMode, editingItem, editingDetail, submitting]
  )

  const handlers = useMemo(
    () => ({
      handleCreate,
      handleAddChild,
      handleEdit,
      handleDelete,
      handleBatchDelete,
      handleFormSubmit,
      setOpen: setModalOpen,
    }),
    [handleCreate, handleAddChild, handleEdit, handleDelete, handleBatchDelete, handleFormSubmit]
  )

  return {
    modal,
    handlers,
    refresh,
    treeData,
    loading,
    ...(enableBatchDelete ? { onSelectedRowsChange: setSelectedRows } : {}),
  }
}
