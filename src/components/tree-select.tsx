import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface TreeNode {
  [key: string]: unknown
  children?: TreeNode[]
}

interface TreeSelectProps {
  data: TreeNode[]
  value?: number | null
  onChange: (id: number | null) => void
  placeholder?: string
  labelField?: string
  valueField?: string
  childrenField?: string
  className?: string
  disabled?: boolean
}

function TreeNodeItem({
  node,
  depth,
  selectedValue,
  onSelect,
  labelField,
  valueField,
  childrenField,
}: {
  node: TreeNode
  depth: number
  selectedValue: number | null
  onSelect: (id: number) => void
  labelField: string
  valueField: string
  childrenField: string
}) {
  const isSelected = node[valueField] === selectedValue
  const children = node[childrenField] as TreeNode[] | undefined

  return (
    <>
      <button
        type="button"
        className={cn(
          'flex w-full items-center px-2 py-1.5 text-sm text-left hover:bg-accent transition-colors',
          isSelected && 'bg-accent text-accent-foreground font-medium'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node[valueField] as number)}
      >
        {node[labelField] as string}
      </button>
      {children?.map((child) => (
        <TreeNodeItem
          key={child[valueField] as number}
          node={child}
          depth={depth + 1}
          selectedValue={selectedValue}
          onSelect={onSelect}
          labelField={labelField}
          valueField={valueField}
          childrenField={childrenField}
        />
      ))}
    </>
  )
}

export function TreeSelect({
  data,
  value,
  onChange,
  placeholder = '请选择',
  labelField = 'name',
  valueField = 'id',
  childrenField = 'children',
  className,
  disabled,
}: TreeSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = useMemo(() => {
    if (value == null) return null
    function find(nodes: TreeNode[]): string | null {
      for (const node of nodes) {
        if ((node[valueField] as number) === value) return node[labelField] as string
        const children = node[childrenField] as TreeNode[] | undefined
        if (children) {
          const found = find(children)
          if (found) return found
        }
      }
      return null
    }
    return find(data)
  }, [data, value, labelField, valueField, childrenField])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSelect = (id: number) => {
    onChange(id)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-input bg-transparent h-8 px-2.5 text-sm',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !selectedLabel && 'text-muted-foreground'
        )}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <span className="flex items-center gap-1">
          {value != null && (
            <span
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground text-xs leading-none px-0.5"
            >
              ×
            </span>
          )}
          <ChevronDownIcon className="size-4 text-muted-foreground shrink-0" />
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-36 max-h-60 overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 py-1">
          {data.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">暂无数据</div>
          ) : (
            data.map((node) => (
              <TreeNodeItem
                key={node[valueField] as number}
                node={node}
                depth={0}
                selectedValue={value ?? null}
                onSelect={handleSelect}
                labelField={labelField}
                valueField={valueField}
                childrenField={childrenField}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
