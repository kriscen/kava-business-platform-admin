import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (submitting) return
      onOpenChange(nextOpen)
    },
    [submitting, onOpenChange]
  )

  const modalTitle =
    mode === 'create' ? t('common.create', { title }) : t('common.editTitle', { title })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={width}>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription className="sr-only">{modalTitle}</DialogDescription>
        </DialogHeader>
        <div className="py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? t('common.submitting') : t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
