import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysDeptListResponse } from '@/types'
import { deptApi } from '@/api/modules/dept'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TreeSelect, type TreeNode } from '@/components/tree-select'

const schema = z.object({
  name: z.string().min(1, i18n.t('dept.namePlaceholder')),
  pid: z.number().nullable().optional(),
  sortOrder: z.number().optional(),
})

export type DeptFormValues = z.infer<typeof schema>

interface DeptFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysDeptListResponse>
  onSubmit: (values: DeptFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function DeptForm({ initialValues, onSubmit, formRef }: DeptFormProps) {
  const { t } = useTranslation()
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DeptFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      pid: null,
      sortOrder: 0,
    },
  })

  useEffect(() => {
    deptApi.getTree().then((res) => {
      setTreeData((res.data ?? []) as unknown as TreeNode[])
    })
  }, [])

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        pid: initialValues.pid ?? null,
        sortOrder: initialValues.sortOrder ?? 0,
      })
    } else {
      reset({ name: '', pid: null, sortOrder: 0 })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="dept-form">
      <div className="space-y-2">
        <Label htmlFor="dept-name">
          {t('dept.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dept-name"
          placeholder={t('dept.namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t('dept.parentDept')}</Label>
        <Controller
          control={control}
          name="pid"
          render={({ field }) => (
            <TreeSelect
              data={treeData}
              value={field.value ?? null}
              onChange={field.onChange}
              placeholder={t('dept.parentDeptPlaceholder')}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dept-sort">{t('dept.sortOrder')}</Label>
        <Input
          id="dept-sort"
          type="number"
          placeholder={t('dept.sortOrderPlaceholder')}
          {...register('sortOrder', { valueAsNumber: true })}
        />
      </div>
    </form>
  )
}
