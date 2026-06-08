import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysFileGroupRequest } from '@/types'
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
  name: z.string().min(1, i18n.t('fileGroup.namePlaceholder')),
  pid: z.number().optional(),
  type: z.string().min(1, i18n.t('fileGroup.typePlaceholder')),
})

export type FileGroupFormValues = z.infer<typeof schema>

interface FileGroupFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysFileGroupRequest>
  onSubmit: (values: FileGroupFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function FileGroupForm({ initialValues, onSubmit, formRef }: FileGroupFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FileGroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      pid: undefined,
      type: '',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        pid: initialValues.pid,
        type: initialValues.type ?? '',
      })
    } else {
      reset({
        name: '',
        pid: undefined,
        type: '',
      })
    }
  }, [initialValues, reset])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      id="file-group-form"
    >
      <div className="space-y-2">
        <Label htmlFor="file-group-name">
          {t('fileGroup.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-group-name"
          placeholder={t('fileGroup.namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-group-pid">{t('fileGroup.pid')}</Label>
        <Input
          id="file-group-pid"
          type="number"
          placeholder={t('fileGroup.pidPlaceholder')}
          {...register('pid', { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-2">
        <Label>
          {t('fileGroup.type')} <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('fileGroup.typePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">{t('common.file')}</SelectItem>
                <SelectItem value="image">{t('common.image')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
      </div>
    </form>
  )
}
