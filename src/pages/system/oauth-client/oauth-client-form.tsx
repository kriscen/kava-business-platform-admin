import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysOauthClientDetailResponse } from '@/types'
import { tenantApi } from '@/api/modules/tenant'
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
  clientId: z.string().min(1, i18n.t('oauthClient.clientIdPlaceholder')),
  clientSecret: z.string().optional(),
  scope: z.string().min(1, i18n.t('oauthClient.scopePlaceholder')),
  authorizedGrantTypes: z.array(z.string()).min(1, i18n.t('oauthClient.grantTypeRequired')),
  webServerRedirectUri: z.string().optional(),
  accessTokenValidity: z.number().optional(),
  refreshTokenValidity: z.number().optional(),
  autoapprove: z.string().optional(),
  tenantId: z.number().optional(),
  userType: z.string().optional(),
})

export type OAuthClientFormValues = z.infer<typeof schema>

interface OAuthClientFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysOauthClientDetailResponse>
  onSubmit: (values: OAuthClientFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

const GRANT_TYPES = [
  { value: 'authorization_code', label: 'oauthClient.grantTypeAuthorizationCode' },
  { value: 'refresh_token', label: 'oauthClient.grantTypeRefreshToken' },
  { value: 'client_credentials', label: 'oauthClient.grantTypeClientCredentials' },
  { value: 'password', label: 'oauthClient.grantTypePassword' },
]

interface TenantOption {
  id: number
  name: string
}

export function OAuthClientForm({ mode, initialValues, onSubmit, formRef }: OAuthClientFormProps) {
  const { t } = useTranslation()
  const [tenants, setTenants] = useState<TenantOption[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<OAuthClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: '',
      clientSecret: '',
      scope: 'server',
      authorizedGrantTypes: [],
      webServerRedirectUri: '',
      accessTokenValidity: 43200,
      refreshTokenValidity: 2592000,
      autoapprove: 'false',
      tenantId: undefined,
      userType: 'B',
    },
  })

  const grantTypesValue = watch('authorizedGrantTypes') ?? []

  useEffect(() => {
    tenantApi.getDropdown().then((res) => {
      setTenants((res.data ?? []).map((d) => ({ id: d.id, name: d.name ?? '' })))
    })
  }, [])

  useEffect(() => {
    if (initialValues) {
      reset({
        clientId: initialValues.clientId ?? '',
        clientSecret: '',
        scope: initialValues.scope ?? 'server',
        authorizedGrantTypes: initialValues.authorizedGrantTypes ?? [],
        webServerRedirectUri: initialValues.webServerRedirectUri ?? '',
        accessTokenValidity: initialValues.accessTokenValidity ?? 43200,
        refreshTokenValidity: initialValues.refreshTokenValidity ?? 2592000,
        autoapprove: initialValues.autoapprove ?? 'false',
        tenantId: initialValues.tenantId ?? undefined,
        userType: initialValues.userType ?? 'B',
      })
    } else {
      reset({
        clientId: '',
        clientSecret: '',
        scope: 'server',
        authorizedGrantTypes: [],
        webServerRedirectUri: '',
        accessTokenValidity: 43200,
        refreshTokenValidity: 2592000,
        autoapprove: 'false',
        tenantId: undefined,
        userType: 'B',
      })
    }
  }, [initialValues, reset])

  const toggleGrantType = (value: string) => {
    const next = grantTypesValue.includes(value)
      ? grantTypesValue.filter((v) => v !== value)
      : [...grantTypesValue, value]
    setValue('authorizedGrantTypes', next, { shouldValidate: true })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      id="oauth-client-form"
    >
      <div className="space-y-2">
        <Label htmlFor="oc-clientId">
          {t('oauthClient.clientId')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="oc-clientId"
          placeholder={t('oauthClient.clientIdPlaceholder')}
          aria-invalid={!!errors.clientId}
          {...register('clientId')}
        />
        {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="oc-clientSecret">
          {t('oauthClient.clientSecret')}
          {mode === 'create' && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id="oc-clientSecret"
          type="password"
          placeholder={t('oauthClient.clientSecretPlaceholder')}
          {...register('clientSecret')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="oc-scope">
          {t('oauthClient.scope')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="oc-scope"
          placeholder={t('oauthClient.scopePlaceholder')}
          {...register('scope')}
        />
      </div>

      <div className="space-y-2">
        <Label>
          {t('oauthClient.authorizedGrantTypes')} <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-3">
          {GRANT_TYPES.map((gt) => (
            <label key={gt.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={grantTypesValue.includes(gt.value)}
                onChange={() => toggleGrantType(gt.value)}
                className="size-3.5 rounded border-input"
              />
              <span className="text-sm">{t(gt.label)}</span>
            </label>
          ))}
        </div>
        {errors.authorizedGrantTypes && (
          <p className="text-xs text-destructive">{errors.authorizedGrantTypes.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="oc-redirectUri">{t('oauthClient.webServerRedirectUri')}</Label>
        <Input
          id="oc-redirectUri"
          placeholder={t('oauthClient.webServerRedirectUriPlaceholder')}
          {...register('webServerRedirectUri')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="oc-accessToken">{t('oauthClient.accessTokenValidity')}</Label>
          <Input
            id="oc-accessToken"
            type="number"
            placeholder={t('oauthClient.accessTokenValidityPlaceholder')}
            {...register('accessTokenValidity', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="oc-refreshToken">{t('oauthClient.refreshTokenValidity')}</Label>
          <Input
            id="oc-refreshToken"
            type="number"
            placeholder={t('oauthClient.refreshTokenValidityPlaceholder')}
            {...register('refreshTokenValidity', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="oc-autoapprove">{t('oauthClient.autoapprove')}</Label>
        <Input
          id="oc-autoapprove"
          placeholder={t('oauthClient.autoapprovePlaceholder')}
          {...register('autoapprove')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('oauthClient.tenantId')}</Label>
        <Controller
          control={control}
          name="tenantId"
          render={({ field }) => (
            <Select
              value={field.value != null ? String(field.value) : ''}
              onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('oauthClient.tenantIdPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={String(tenant.id)}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="oc-userType">{t('oauthClient.userType')}</Label>
        <Input
          id="oc-userType"
          placeholder={t('oauthClient.userTypePlaceholder')}
          {...register('userType')}
        />
      </div>
    </form>
  )
}
