import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysI18nListResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  code: z.string().min(1, i18n.t('i18n.codePlaceholder')),
  language: z.string().min(1, i18n.t('i18n.languagePlaceholder')),
  content: z.string().min(1, i18n.t('i18n.contentPlaceholder')),
})

export type I18nFormValues = z.infer<typeof schema>

interface I18nFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysI18nListResponse>
  onSubmit: (values: I18nFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

const LANGUAGES = [
  { value: 'zh-CN', label: 'i18n.langZhCN' },
  { value: 'en-US', label: 'i18n.langEnUS' },
  { value: 'ja-JP', label: 'i18n.langJaJP' },
]

export function I18nForm({ mode, initialValues, onSubmit, formRef }: I18nFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<I18nFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', language: '', content: '' },
  })

  const languageValue = watch('language')

  useEffect(() => {
    if (initialValues) {
      reset({
        code: initialValues.code ?? '',
        language: initialValues.language ?? '',
        content: initialValues.content ?? '',
      })
    } else {
      reset({ code: '', language: '', content: '' })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="i18n-form">
      <div className="space-y-2">
        <Label htmlFor="i18n-code">
          {t('i18n.code')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="i18n-code"
          placeholder={t('i18n.codePlaceholder')}
          aria-invalid={!!errors.code}
          disabled={mode === 'edit'}
          {...register('code')}
        />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>
          {t('i18n.language')} <span className="text-destructive">*</span>
        </Label>
        <Select
          value={languageValue}
          onValueChange={(v) => v && setValue('language', v, { shouldValidate: true })}
          disabled={mode === 'edit'}
        >
          <SelectTrigger aria-invalid={!!errors.language}>
            <SelectValue placeholder={t('i18n.languagePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {t(lang.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('language')} />
        {errors.language && <p className="text-xs text-destructive">{errors.language.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="i18n-content">
          {t('i18n.content')} <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="i18n-content"
          placeholder={t('i18n.contentPlaceholder')}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errors.content}
          {...register('content')}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>
    </form>
  )
}
