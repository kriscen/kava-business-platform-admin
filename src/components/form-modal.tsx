import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  title: string
  onConfirm: () => Promise<void> | void
  children: React.ReactNode
  width?: string
  submitting?: boolean
}

export function FormModal({
  open,
  onOpenChange,
  mode,
  title,
  onConfirm,
  children,
  width = 'sm:max-w-md',
  submitting = false,
}: FormModalProps) {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (submitting) return
      onOpenChange(nextOpen)
    },
    [submitting, onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={width}>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? `新增${title}` : `编辑${title}`}</DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'create' ? `新增${title}` : `编辑${title}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            取消
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? '提交中...' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
