import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysPublicParamListResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  publicName: z.string().min(1, i18n.t('publicParam.publicNamePlaceholder')),
  publicKey: z.string().min(1, i18n.t('publicParam.publicKeyPlaceholder')),
  publicValue: z.string().min(1, i18n.t('publicParam.publicValuePlaceholder')),
  status: z.string().optional(),
  publicType: z.string().optional(),
  systemFlag: z.string().optional(),
  remark: z.string().optional(),
})

export type PublicParamFormValues = z.infer<typeof schema>

interface PublicParamFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysPublicParamListResponse>
  onSubmit: (values: PublicParamFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function PublicParamForm({ initialValues, onSubmit, formRef }: PublicParamFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PublicParamFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      publicName: '',
      publicKey: '',
      publicValue: '',
      status: '0',
      publicType: '0',
      systemFlag: '0',
      remark: '',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        publicName: initialValues.publicName ?? '',
        publicKey: initialValues.publicKey ?? '',
        publicValue: initialValues.publicValue ?? '',
        status: initialValues.status ?? '0',
        publicType: initialValues.publicType ?? '0',
        systemFlag: initialValues.systemFlag ?? '0',
        remark: initialValues.remark ?? '',
      })
    } else {
      reset({
        publicName: '',
        publicKey: '',
        publicValue: '',
        status: '0',
        publicType: '0',
        systemFlag: '0',
        remark: '',
      })
    }
  }, [initialValues, reset])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      id="public-param-form"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="param-name">
            {t('publicParam.publicName')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="param-name"
            placeholder={t('publicParam.publicNamePlaceholder')}
            aria-invalid={!!errors.publicName}
            {...register('publicName')}
          />
          {errors.publicName && (
            <p className="text-xs text-destructive">{errors.publicName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="param-key">
            {t('publicParam.publicKey')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="param-key"
            placeholder={t('publicParam.publicKeyPlaceholder')}
            aria-invalid={!!errors.publicKey}
            {...register('publicKey')}
          />
          {errors.publicKey && (
            <p className="text-xs text-destructive">{errors.publicKey.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="param-value">
          {t('publicParam.publicValue')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="param-value"
          placeholder={t('publicParam.publicValuePlaceholder')}
          aria-invalid={!!errors.publicValue}
          {...register('publicValue')}
        />
        {errors.publicValue && (
          <p className="text-xs text-destructive">{errors.publicValue.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{t('publicParam.status')}</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('common.normal')}</SelectItem>
                  <SelectItem value="9">{t('common.locked')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('publicParam.publicType')}</Label>
          <Controller
            control={control}
            name="publicType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('publicParam.typeSystem')}</SelectItem>
                  <SelectItem value="1">{t('publicParam.typeCustom')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('publicParam.systemFlag')}</Label>
          <Controller
            control={control}
            name="systemFlag"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t('publicParam.no')}</SelectItem>
                  <SelectItem value="1">{t('publicParam.yes')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="param-remark">{t('publicParam.remark')}</Label>
        <Textarea
          id="param-remark"
          placeholder={t('publicParam.remarkPlaceholder')}
          rows={3}
          {...register('remark')}
        />
      </div>
    </form>
  )
}
