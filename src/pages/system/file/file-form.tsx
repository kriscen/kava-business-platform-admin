import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysFileDetailResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  fileName: z.string().min(1, i18n.t('file.fileNamePlaceholder')),
  original: z.string().min(1, i18n.t('file.originalPlaceholder')),
  bucketName: z.string().min(1, i18n.t('file.bucketNamePlaceholder')),
  dir: z.string().min(1, i18n.t('file.dirPlaceholder')),
  type: z.string().min(1, i18n.t('file.typePlaceholder')),
  groupId: z.number().optional(),
  fileSize: z.number().min(0, i18n.t('file.fileSizePlaceholder')),
})

export type FileFormValues = z.infer<typeof schema>

interface FileFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysFileDetailResponse>
  onSubmit: (values: FileFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function FileForm({ initialValues, onSubmit, formRef }: FileFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fileName: '',
      original: '',
      bucketName: '',
      dir: '',
      type: '',
      groupId: undefined,
      fileSize: 0,
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        fileName: initialValues.fileName ?? '',
        original: initialValues.original ?? '',
        bucketName: initialValues.bucketName ?? '',
        dir: initialValues.dir ?? '',
        type: initialValues.type ?? '',
        groupId: initialValues.groupId,
        fileSize: initialValues.fileSize ?? 0,
      })
    } else {
      reset({
        fileName: '',
        original: '',
        bucketName: '',
        dir: '',
        type: '',
        groupId: undefined,
        fileSize: 0,
      })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="file-form">
      <div className="space-y-2">
        <Label htmlFor="file-name">
          {t('file.fileName')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-name"
          placeholder={t('file.fileNamePlaceholder')}
          aria-invalid={!!errors.fileName}
          {...register('fileName')}
        />
        {errors.fileName && <p className="text-xs text-destructive">{errors.fileName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-original">
          {t('file.original')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-original"
          placeholder={t('file.originalPlaceholder')}
          aria-invalid={!!errors.original}
          {...register('original')}
        />
        {errors.original && <p className="text-xs text-destructive">{errors.original.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-bucket">
          {t('file.bucketName')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-bucket"
          placeholder={t('file.bucketNamePlaceholder')}
          aria-invalid={!!errors.bucketName}
          {...register('bucketName')}
        />
        {errors.bucketName && (
          <p className="text-xs text-destructive">{errors.bucketName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-dir">
          {t('file.dir')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-dir"
          placeholder={t('file.dirPlaceholder')}
          aria-invalid={!!errors.dir}
          {...register('dir')}
        />
        {errors.dir && <p className="text-xs text-destructive">{errors.dir.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-type">
          {t('file.type')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-type"
          placeholder={t('file.typePlaceholder')}
          aria-invalid={!!errors.type}
          {...register('type')}
        />
        {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-size">
          {t('file.fileSize')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file-size"
          type="number"
          placeholder={t('file.fileSizePlaceholder')}
          aria-invalid={!!errors.fileSize}
          {...register('fileSize', { valueAsNumber: true })}
        />
        {errors.fileSize && <p className="text-xs text-destructive">{errors.fileSize.message}</p>}
      </div>
    </form>
  )
}
