import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysUserRequest } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const baseSchema = z.object({
  username: z.string().min(1, i18n.t('user.usernamePlaceholder')),
  password: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(i18n.t('user.emailInvalid')).optional().or(z.literal('')),
  nickname: z.string().optional(),
  name: z.string().optional(),
  lockFlag: z.string().optional(),
})

export function getUserFormSchema(mode: 'create' | 'edit') {
  if (mode === 'create') {
    return baseSchema.refine((data) => data.password && data.password.length > 0, {
      message: i18n.t('user.passwordRequired'),
      path: ['password'],
    })
  }
  return baseSchema
}

export type UserFormValues = z.infer<typeof baseSchema>

interface UserFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<SysUserRequest>
  onSubmit: (values: UserFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function UserForm({ mode, initialValues, onSubmit, formRef }: UserFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(getUserFormSchema(mode)),
    defaultValues: {
      username: '',
      password: '',
      phone: '',
      email: '',
      nickname: '',
      name: '',
      lockFlag: '0',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        username: initialValues.username ?? '',
        password: '',
        phone: initialValues.phone ?? '',
        email: initialValues.email ?? '',
        nickname: initialValues.nickname ?? '',
        name: initialValues.name ?? '',
        lockFlag: initialValues.lockFlag ?? '0',
      })
    } else {
      reset({
        username: '',
        password: '',
        phone: '',
        email: '',
        nickname: '',
        name: '',
        lockFlag: '0',
      })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="user-form">
      <div className="space-y-2">
        <Label htmlFor="username">
          {t('user.username')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="username"
          placeholder={t('user.usernamePlaceholder')}
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
      </div>

      {mode === 'create' && (
        <div className="space-y-2">
          <Label htmlFor="password">
            {t('login.password')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t('user.phone')}</Label>
          <Input id="phone" placeholder={t('user.phonePlaceholder')} {...register('phone')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('user.email')}</Label>
          <Input
            id="email"
            placeholder={t('user.emailPlaceholder')}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nickname">{t('user.nickname')}</Label>
          <Input
            id="nickname"
            placeholder={t('user.nicknamePlaceholder')}
            {...register('nickname')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">{t('user.name')}</Label>
          <Input id="name" placeholder={t('user.namePlaceholder')} {...register('name')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('user.status')}</Label>
        <Controller
          control={control}
          name="lockFlag"
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
    </form>
  )
}
