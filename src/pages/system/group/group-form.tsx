import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysGroupDetailResponse, SysGroupListResponse } from '@/types'
import { groupApi } from '@/api/modules/group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TreeSelect, type TreeNode } from '@/components/tree-select'

const schema = z.object({
  name: z.string().min(1, i18n.t('group.namePlaceholder')),
  pid: z.number().nullable().optional(),
  sortOrder: z.number().optional(),
})

export type GroupFormValues = z.infer<typeof schema>

function excludeSubtree(nodes: SysGroupListResponse[], id: number): SysGroupListResponse[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({
      ...n,
      children: excludeSubtree(n.children ?? [], id),
    }))
}

interface GroupFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysGroupDetailResponse>
  onSubmit: (values: GroupFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
  excludeId?: number
}

export function GroupForm({ initialValues, onSubmit, formRef, excludeId }: GroupFormProps) {
  const { t } = useTranslation()
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      pid: null,
      sortOrder: 0,
    },
  })

  useEffect(() => {
    groupApi.getTree().then((res) => {
      const raw = (res.data ?? []) as SysGroupListResponse[]
      const filtered = excludeId != null ? excludeSubtree(raw, excludeId) : raw
      setTreeData(filtered as unknown as TreeNode[])
    })
  }, [excludeId])

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        pid: initialValues.pid ?? null,
        sortOrder: initialValues.sortOrder ?? 0,
      })
    } else {
      reset({
        name: '',
        pid: null,
        sortOrder: 0,
      })
    }
  }, [initialValues, reset])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      id="group-form"
    >
      <div className="space-y-2">
        <Label htmlFor="group-name">
          {t('group.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="group-name"
          placeholder={t('group.namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t('group.parentGroup')}</Label>
        <Controller
          control={control}
          name="pid"
          render={({ field }) => (
            <TreeSelect
              data={treeData}
              value={field.value ?? null}
              onChange={field.onChange}
              placeholder={t('group.parentGroupPlaceholder')}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-sortOrder">{t('group.sortOrder')}</Label>
        <Input
          id="group-sortOrder"
          type="number"
          placeholder={t('group.sortOrderPlaceholder')}
          {...register('sortOrder', { valueAsNumber: true })}
        />
      </div>
    </form>
  )
}
