import { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm?: () => Promise<void>
}

function ConfirmDialogInner({
  options,
  onResolve,
}: {
  options: ConfirmOptions
  onResolve: (value: boolean) => void
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)

  const confirmText = options.confirmText || t('common.confirm')
  const cancelText = options.cancelText || t('common.cancel')

  const handleConfirm = useCallback(async () => {
    if (options.onConfirm) {
      setLoading(true)
      try {
        await options.onConfirm()
        setOpen(false)
        onResolve(true)
      } catch {
        toast.error(t('common.error'))
      } finally {
        setLoading(false)
      }
    } else {
      setOpen(false)
      onResolve(true)
    }
  }, [options, onResolve, t])

  const handleCancel = useCallback(() => {
    if (loading) return
    setOpen(false)
    onResolve(false)
  }, [loading, onResolve])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (loading) return
      if (!nextOpen) {
        setOpen(false)
        onResolve(false)
      }
    },
    [loading, onResolve]
  )

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          {options.description && (
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={options.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const onResolve = (value: boolean) => {
      resolve(value)
      setTimeout(() => {
        root.unmount()
        container.remove()
      }, 150)
    }

    root.render(<ConfirmDialogInner options={options} onResolve={onResolve} />)
  })
}
