import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysAppRequest } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  code: z.string().min(1, i18n.t('app.codePlaceholder')),
  name: z.string().min(1, i18n.t('app.namePlaceholder')),
  icon: z.string().optional(),
  description: z.string().optional(),
})

export type AppFormValues = z.infer<typeof schema>

interface AppFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysAppRequest>
  onSubmit: (values: AppFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function AppForm({ initialValues, onSubmit, formRef }: AppFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      icon: '',
      description: '',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        code: initialValues.code ?? '',
        name: initialValues.name ?? '',
        icon: initialValues.icon ?? '',
        description: initialValues.description ?? '',
      })
    } else {
      reset({
        code: '',
        name: '',
        icon: '',
        description: '',
      })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="app-form">
      <div className="space-y-2">
        <Label htmlFor="app-code">
          {t('app.code')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="app-code"
          placeholder={t('app.codePlaceholder')}
          aria-invalid={!!errors.code}
          {...register('code')}
        />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-name">
          {t('app.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="app-name"
          placeholder={t('app.namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-icon">{t('app.icon')}</Label>
        <Input id="app-icon" placeholder={t('app.iconPlaceholder')} {...register('icon')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-description">{t('app.description')}</Label>
        <Textarea
          id="app-description"
          placeholder={t('app.descriptionPlaceholder')}
          rows={3}
          {...register('description')}
        />
      </div>
    </form>
  )
}
