import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

import type { DataTableColumn } from './data-table'

export interface TreeTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey?: keyof T & string
  childrenField?: string
  searchSlot?: React.ReactNode
  toolbarSlot?: React.ReactNode
  loading?: boolean
  onLoadChildren?: (row: T) => Promise<T[]>
}

interface FlatRow<T> {
  item: T
  depth: number
  key: string
  hasChildren: boolean
  isExpanded: boolean
}

export function TreeTable<T>({
  columns,
  data,
  rowKey = 'id' as keyof T & string,
  childrenField = 'children',
  searchSlot,
  toolbarSlot,
  loading = false,
  onLoadChildren,
}: TreeTableProps<T>) {
  const { t } = useTranslation()
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set())
  const [loadedChildren, setLoadedChildren] = useState<Record<string, T[]>>({})

  const toggleExpand = useCallback(
    async (key: string, row: T) => {
      const next = new Set(expandedKeys)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
        if (onLoadChildren && !loadedChildren[key]) {
          const children = (row as Record<string, unknown>)[childrenField] as T[] | undefined
          if (!children || children.length === 0) {
            setLoadingKeys((prev) => new Set(prev).add(key))
            try {
              const loaded = await onLoadChildren(row)
              setLoadedChildren((prev) => ({ ...prev, [key]: loaded }))
            } finally {
              setLoadingKeys((prev) => {
                const n = new Set(prev)
                n.delete(key)
                return n
              })
            }
          }
        }
      }
      setExpandedKeys(next)
    },
    [expandedKeys, onLoadChildren, loadedChildren, childrenField]
  )

  const flatRows = useMemo(() => {
    const result: FlatRow<T>[] = []

    function walk(items: T[], depth: number) {
      for (const item of items) {
        const key = String(item[rowKey])
        const directChildren = (item as Record<string, unknown>)[childrenField] as T[] | undefined
        const lazyChildren = loadedChildren[key]
        const children = lazyChildren ?? directChildren
        const hasChildren =
          !!(children && children.length > 0) ||
          (!!onLoadChildren &&
            !loadedChildren[key] &&
            !(directChildren && directChildren.length > 0))
        const isExpanded = expandedKeys.has(key)

        result.push({ item, depth, key, hasChildren, isExpanded })

        if (hasChildren && isExpanded && children) {
          walk(children, depth + 1)
        }
      }
    }

    walk(data, 0)
    return result
  }, [data, rowKey, childrenField, expandedKeys, loadedChildren, onLoadChildren])

  return (
    <div className="space-y-4">
      {searchSlot && <div>{searchSlot}</div>}
      <div className="flex items-center justify-between">
        {toolbarSlot && <div>{toolbarSlot}</div>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.title}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : flatRows.length > 0 ? (
              flatRows.map(({ item, depth, key, hasChildren, isExpanded }) => (
                <TableRow key={key}>
                  {columns.map((col) => {
                    const value = item[col.key as keyof T]
                    const isFirstCol = col.key === columns[0].key

                    return (
                      <TableCell key={col.key}>
                        {isFirstCol ? (
                          <div
                            className="flex items-center gap-1"
                            style={{ paddingLeft: `${depth * 20}px` }}
                          >
                            {hasChildren ? (
                              <button
                                type="button"
                                className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-accent"
                                onClick={() => toggleExpand(key, item)}
                              >
                                {loadingKeys.has(key) ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : isExpanded ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>
                            ) : (
                              <span className="size-5 shrink-0" />
                            )}
                            {col.render ? col.render(value, item) : String(value ?? '')}
                          </div>
                        ) : col.render ? (
                          col.render(value, item)
                        ) : (
                          String(value ?? '')
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
