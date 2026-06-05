import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysTenantListResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const baseSchema = z.object({
  name: z.string().min(1, i18n.t('tenant.namePlaceholder')),
  code: z.string().min(1, i18n.t('tenant.codePlaceholder')),
  tenantDomain: z.string().optional(),
  websiteName: z.string().optional(),
  logo: z.string().optional(),
  footer: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.string().optional(),
  adminUsername: z.string().optional(),
  adminPassword: z.string().optional(),
})

export function getTenantFormSchema(mode: 'create' | 'edit') {
  if (mode === 'create') {
    return baseSchema.refine((data) => data.adminUsername && data.adminUsername.length > 0, {
      message: i18n.t('tenant.adminUsernamePlaceholder'),
      path: ['adminUsername'],
    })
  }
  return baseSchema
}

export type TenantFormValues = z.infer<typeof baseSchema>

interface TenantFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<SysTenantListResponse>
  onSubmit: (values: TenantFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function TenantForm({ mode, initialValues, onSubmit, formRef }: TenantFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(getTenantFormSchema(mode)),
    defaultValues: {
      name: '',
      code: '',
      tenantDomain: '',
      websiteName: '',
      logo: '',
      footer: '',
      startTime: '',
      endTime: '',
      status: '0',
      adminUsername: '',
      adminPassword: '',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        code: initialValues.code ?? '',
        tenantDomain: initialValues.tenantDomain ?? '',
        websiteName: initialValues.websiteName ?? '',
        logo: initialValues.logo ?? '',
        footer: initialValues.footer ?? '',
        startTime: initialValues.startTime ?? '',
        endTime: initialValues.endTime ?? '',
        status: initialValues.status ?? '0',
        adminUsername: '',
        adminPassword: '',
      })
    } else {
      reset({
        name: '',
        code: '',
        tenantDomain: '',
        websiteName: '',
        logo: '',
        footer: '',
        startTime: '',
        endTime: '',
        status: '0',
        adminUsername: '',
        adminPassword: '',
      })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="tenant-form">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenant-name">
            {t('tenant.name')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tenant-name"
            placeholder={t('tenant.namePlaceholder')}
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tenant-code">
            {t('tenant.code')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tenant-code"
            placeholder={t('tenant.codePlaceholder')}
            aria-invalid={!!errors.code}
            {...register('code')}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenant-domain">{t('tenant.domain')}</Label>
          <Input
            id="tenant-domain"
            placeholder={t('tenant.domainPlaceholder')}
            {...register('tenantDomain')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tenant-website">{t('tenant.websiteName')}</Label>
          <Input
            id="tenant-website"
            placeholder={t('tenant.websiteNamePlaceholder')}
            {...register('websiteName')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('tenant.startTime')}</Label>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('tenant.endTime')}</Label>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('tenant.status')}</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('tenant.active')}</SelectItem>
                <SelectItem value="9">{t('tenant.expired')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {mode === 'create' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tenant-admin-user">
              {t('tenant.adminUsername')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tenant-admin-user"
              placeholder={t('tenant.adminUsernamePlaceholder')}
              aria-invalid={!!errors.adminUsername}
              {...register('adminUsername')}
            />
            {errors.adminUsername && (
              <p className="text-xs text-destructive">{errors.adminUsername.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenant-admin-pwd">{t('tenant.adminPassword')}</Label>
            <Input
              id="tenant-admin-pwd"
              type="password"
              placeholder={t('tenant.adminPasswordPlaceholder')}
              {...register('adminPassword')}
            />
          </div>
        </div>
      )}
    </form>
  )
}
