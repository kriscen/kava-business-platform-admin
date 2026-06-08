import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysRouteConfDetailResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function isValidJson(str: string): boolean {
  if (!str || !str.trim()) return true
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

const schema = z.object({
  routeId: z.string().min(1, i18n.t('routeConf.routeIdPlaceholder')),
  routeName: z.string().min(1, i18n.t('routeConf.routeNamePlaceholder')),
  predicates: z.string().refine(isValidJson, i18n.t('routeConf.invalidJson')),
  filters: z.string().refine(isValidJson, i18n.t('routeConf.invalidJson')),
  uri: z.string().min(1, i18n.t('routeConf.uriPlaceholder')),
  sortOrder: z.number().optional(),
  metadata: z.string().refine(isValidJson, i18n.t('routeConf.invalidJson')).optional(),
})

export type RouteConfFormValues = z.infer<typeof schema>

interface RouteConfFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysRouteConfDetailResponse>
  onSubmit: (values: RouteConfFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function RouteConfForm({ initialValues, onSubmit, formRef }: RouteConfFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RouteConfFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      routeId: '',
      routeName: '',
      predicates: '[]',
      filters: '[]',
      uri: '',
      sortOrder: 0,
      metadata: '{}',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        routeId: initialValues.routeId ?? '',
        routeName: initialValues.routeName ?? '',
        predicates: initialValues.predicates ?? '[]',
        filters: initialValues.filters ?? '[]',
        uri: initialValues.uri ?? '',
        sortOrder: initialValues.sortOrder ?? 0,
        metadata: initialValues.metadata ?? '{}',
      })
    } else {
      reset({
        routeId: '',
        routeName: '',
        predicates: '[]',
        filters: '[]',
        uri: '',
        sortOrder: 0,
        metadata: '{}',
      })
    }
  }, [initialValues, reset])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      id="route-conf-form"
    >
      <div className="space-y-2">
        <Label htmlFor="rc-routeId">
          {t('routeConf.routeId')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="rc-routeId"
          placeholder={t('routeConf.routeIdPlaceholder')}
          aria-invalid={!!errors.routeId}
          {...register('routeId')}
        />
        {errors.routeId && <p className="text-xs text-destructive">{errors.routeId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rc-routeName">
          {t('routeConf.routeName')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="rc-routeName"
          placeholder={t('routeConf.routeNamePlaceholder')}
          aria-invalid={!!errors.routeName}
          {...register('routeName')}
        />
        {errors.routeName && <p className="text-xs text-destructive">{errors.routeName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rc-uri">
          {t('routeConf.uri')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="rc-uri"
          placeholder={t('routeConf.uriPlaceholder')}
          aria-invalid={!!errors.uri}
          {...register('uri')}
        />
        {errors.uri && <p className="text-xs text-destructive">{errors.uri.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rc-sortOrder">{t('routeConf.sortOrder')}</Label>
        <Input
          id="rc-sortOrder"
          type="number"
          placeholder={t('routeConf.sortOrderPlaceholder')}
          {...register('sortOrder', { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rc-predicates">
          {t('routeConf.predicates')} <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="rc-predicates"
          placeholder={t('routeConf.predicatesPlaceholder')}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-mono focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-invalid={!!errors.predicates}
          {...register('predicates')}
        />
        {errors.predicates && (
          <p className="text-xs text-destructive">{errors.predicates.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rc-filters">
          {t('routeConf.filters')} <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="rc-filters"
          placeholder={t('routeConf.filtersPlaceholder')}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-mono focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-invalid={!!errors.filters}
          {...register('filters')}
        />
        {errors.filters && <p className="text-xs text-destructive">{errors.filters.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rc-metadata">{t('routeConf.metadata')}</Label>
        <textarea
          id="rc-metadata"
          placeholder={t('routeConf.metadataPlaceholder')}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-mono focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-invalid={!!errors.metadata}
          {...register('metadata')}
        />
        {errors.metadata && <p className="text-xs text-destructive">{errors.metadata.message}</p>}
      </div>
    </form>
  )
}
