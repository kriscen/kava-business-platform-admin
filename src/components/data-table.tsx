import { useEffect, useMemo, useState } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

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
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rowSelection, setRowSelection] = useState({})

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
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected() || false}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
    return [selectCol, ...tanstackColumns]
  }, [tanstackColumns, onSelectedRowsChange])

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
    fetchData({ pageNo, pageSize }).then((res) => {
      if (cancelled) return
      setData(res.records)
      setTotal(res.total)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [fetchData, pageNo, pageSize, refreshKey])

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
      {searchSlot && <div>{searchSlot}</div>}
      <div className="flex items-center justify-between">
        {toolbarSlot && <div>{toolbarSlot}</div>}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
            {loading ? (
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
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>每页</span>
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
            <span>条，共 {total} 条</span>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
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
