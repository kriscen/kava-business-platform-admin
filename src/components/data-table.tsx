import { useEffect, useMemo, useState } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DataTableColumn<T> {
  key: string & keyof T
  title: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  fetchData: (params: {
    pageNo: number
    pageSize: number
  }) => Promise<{ records: T[]; total: number }>
  searchSlot?: React.ReactNode
  toolbarSlot?: React.ReactNode
  rowKey?: keyof T & string
  onSelectedRowsChange?: (rows: T[]) => void
  refreshKey?: number
}

const PAGE_SIZE_OPTIONS = ['10', '20', '50']

export function DataTable<T>({
  columns,
  fetchData,
  searchSlot,
  toolbarSlot,
  rowKey = 'id' as keyof T & string,
  onSelectedRowsChange,
  refreshKey,
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rowSelection, setRowSelection] = useState({})
  const [dataVersion, setDataVersion] = useState(0)

  const tanstackColumns = useMemo<ColumnDef<T>[]>(
    () => [
      ...columns.map((col) => ({
        id: col.key,
        accessorKey: col.key,
        header: col.title,
        cell: ({ row }: { row: { original: T } }) => {
          const value = row.original[col.key as keyof T]
          return col.render ? col.render(value, row.original) : String(value ?? '')
        },
      })),
    ],
    [columns]
  )

  const allColumns = useMemo<ColumnDef<T>[]>(() => {
    if (!onSelectedRowsChange) return tanstackColumns
    const selectCol: ColumnDef<T> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label={t('common.selectAllRows')}
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={t('common.selectRow')}
          checked={row.getIsSelected() || false}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
    return [selectCol, ...tanstackColumns]
  }, [tanstackColumns, onSelectedRowsChange, t])

  const table = useReactTable({
    data,
    columns: allColumns,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: { pageIndex: pageNo - 1, pageSize },
      rowSelection,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex: pageNo - 1, pageSize }) : updater
      setPageNo(next.pageIndex + 1)
      setPageSize(next.pageSize)
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    getRowId: (row) => String(row[rowKey]),
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchData({ pageNo, pageSize })
      .then((res) => {
        if (cancelled) return
        setData(res.records)
        setTotal(res.total)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(t('common.error'))
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [fetchData, pageNo, pageSize, refreshKey, dataVersion, t])

  useEffect(() => {
    onSelectedRowsChange?.(table.getSelectedRowModel().rows.map((r) => r.original))
  }, [rowSelection, table, onSelectedRowsChange])

  const totalPages = Math.ceil(total / pageSize)

  function getPageRange(): (number | 'ellipsis')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    const start = Math.max(2, pageNo - 1)
    const end = Math.min(totalPages - 1, pageNo + 1)
    if (start > 2) pages.push('ellipsis')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="space-y-4">
      {searchSlot && <div className="rounded-lg border bg-card p-4 shadow-sm">{searchSlot}</div>}
      {toolbarSlot && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">{toolbarSlot}</div>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm" aria-busy={loading}>
        <Table className="min-w-[760px]">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3" role="status">
                    <AlertCircle className="size-10 text-destructive" />
                    <p className="text-muted-foreground">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError(null)
                        setDataVersion((v) => v + 1)
                      }}
                    >
                      {t('common.retry')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {allColumns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center">
                  <span className="text-muted-foreground">{t('common.noData')}</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border bg-card px-3 py-2 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{t('common.perPage')}</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPageNo(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>{t('common.totalCount', { count: total })}</span>
          </div>
          <Pagination className="justify-start lg:justify-end">
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  text={t('common.previousPage')}
                  aria-label={t('common.previousPage')}
                  onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                  className={cn(pageNo <= 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
              {getPageRange().map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`e${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink isActive={p === pageNo} onClick={() => setPageNo(p)}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  text={t('common.nextPage')}
                  aria-label={t('common.nextPage')}
                  onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
                  className={cn(pageNo >= totalPages && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
