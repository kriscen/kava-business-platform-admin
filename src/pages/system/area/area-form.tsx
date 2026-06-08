import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysAreaDetailResponse } from '@/types'
import { areaApi } from '@/api/modules/area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TreeSelect, type TreeNode } from '@/components/tree-select'

const schema = z.object({
  name: z.string().min(1, i18n.t('area.namePlaceholder')),
  pid: z.number().nullable().optional(),
  adcode: z.number().optional(),
  areaType: z.string().optional(),
  areaStatus: z.string().optional(),
  cityCode: z.string().optional(),
})

export type AreaFormValues = z.infer<typeof schema>

interface AreaFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysAreaDetailResponse>
  onSubmit: (values: AreaFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

const AREA_TYPES = [
  { value: '0', label: 'area.areaTypeCountry' },
  { value: '1', label: 'area.areaTypeProvince' },
  { value: '2', label: 'area.areaTypeCity' },
  { value: '3', label: 'area.areaTypeDistrict' },
]

const AREA_STATUSES = [
  { value: '1', label: 'area.areaStatusEnabled' },
  { value: '0', label: 'area.areaStatusDisabled' },
]

export function AreaForm({ initialValues, onSubmit, formRef }: AreaFormProps) {
  const { t } = useTranslation()
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AreaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      pid: null,
      adcode: undefined,
      areaType: '3',
      areaStatus: '1',
      cityCode: '',
    },
  })

  useEffect(() => {
    areaApi.getTree().then((res) => {
      setTreeData((res.data ?? []) as unknown as TreeNode[])
    })
  }, [])

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        pid: initialValues.pid ?? null,
        adcode: initialValues.adcode ?? undefined,
        areaType: initialValues.areaType ?? '3',
        areaStatus: initialValues.areaStatus ?? '1',
        cityCode: initialValues.cityCode ?? '',
      })
    } else {
      reset({
        name: '',
        pid: null,
        adcode: undefined,
        areaType: '3',
        areaStatus: '1',
        cityCode: '',
      })
    }
  }, [initialValues, reset])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      id="area-form"
    >
      <div className="space-y-2">
        <Label htmlFor="area-name">
          {t('area.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="area-name"
          placeholder={t('area.namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t('area.parentArea')}</Label>
        <Controller
          control={control}
          name="pid"
          render={({ field }) => (
            <TreeSelect
              data={treeData}
              value={field.value ?? null}
              onChange={field.onChange}
              placeholder={t('area.parentAreaPlaceholder')}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area-adcode">{t('area.adcode')}</Label>
        <Input
          id="area-adcode"
          type="number"
          placeholder={t('area.adcodePlaceholder')}
          {...register('adcode', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{t('area.areaType')}</Label>
          <Controller
            control={control}
            name="areaType"
            render={({ field }) => (
              <Select value={field.value ?? '3'} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('area.areaTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {AREA_TYPES.map((at) => (
                    <SelectItem key={at.value} value={at.value}>
                      {t(at.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('area.areaStatus')}</Label>
          <Controller
            control={control}
            name="areaStatus"
            render={({ field }) => (
              <Select value={field.value ?? '1'} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('area.areaStatusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {AREA_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {t(s.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area-cityCode">{t('area.cityCode')}</Label>
        <Input
          id="area-cityCode"
          placeholder={t('area.cityCodePlaceholder')}
          {...register('cityCode')}
        />
      </div>
    </form>
  )
}
