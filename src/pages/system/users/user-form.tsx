import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type {
  SysGroupListResponse,
  SysRoleDropdownResponse,
  SysTenantDropdownResponse,
} from '@/types'
import type { SysUserRequest } from '@/types'
import { groupApi } from '@/api/modules/group'
import { roleApi } from '@/api/modules/role'
import { tenantApi } from '@/api/modules/tenant'
import { useAuthStore } from '@/stores/authStore'
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
  groupId: z.number().optional(),
  roleIds: z.array(z.number()).optional(),
  tenantId: z.number().optional(),
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
  initialValues?: Partial<SysUserRequest> & { groupName?: string; roleNames?: string[] }
  onSubmit: (values: UserFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

function GroupTreeRadio({
  nodes,
  selectedId,
  onChange,
  depth = 0,
}: {
  nodes: SysGroupListResponse[]
  selectedId?: number
  onChange: (id: number) => void
  depth?: number
}) {
  return (
    <div>
      {nodes.map((node) => (
        <div key={node.id} style={{ paddingLeft: `${depth * 16}px` }}>
          <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-accent rounded px-1">
            <input
              type="radio"
              name="group-radio"
              checked={selectedId === node.id}
              onChange={() => onChange(node.id)}
              className="size-3.5 border-input"
            />
            <span className="text-sm">{node.name}</span>
          </label>
          {node.children && node.children.length > 0 && (
            <GroupTreeRadio
              nodes={node.children}
              selectedId={selectedId}
              onChange={onChange}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function RoleCheckboxList({
  roles,
  selectedIds,
  onChange,
}: {
  roles: SysRoleDropdownResponse[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}) {
  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div>
      {roles.map((role) => (
        <label
          key={role.id}
          className="flex items-center gap-2 py-1 cursor-pointer hover:bg-accent rounded px-1"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(role.id)}
            onChange={() => toggle(role.id)}
            className="size-3.5 rounded border-input"
          />
          <span className="text-sm">{role.roleName}</span>
        </label>
      ))}
    </div>
  )
}

export function UserForm({ mode, initialValues, onSubmit, formRef }: UserFormProps) {
  const { t } = useTranslation()
  const userInfo = useAuthStore((state) => state.userInfo)
  const isPlatformAdmin = userInfo?.role === 'platform_admin'

  const [groupTree, setGroupTree] = useState<SysGroupListResponse[]>([])
  const [roles, setRoles] = useState<SysRoleDropdownResponse[]>([])
  const [tenants, setTenants] = useState<SysTenantDropdownResponse[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
      groupId: undefined,
      roleIds: [],
      tenantId: undefined,
    },
  })

  const groupIdValue = watch('groupId')
  const roleIdsValue = watch('roleIds') ?? []

  useEffect(() => {
    groupApi
      .getTree()
      .then((res) => {
        setGroupTree(res.data ?? [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    roleApi
      .getDropdown()
      .then((res) => {
        setRoles(res.data ?? [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isPlatformAdmin) {
      tenantApi
        .getDropdown()
        .then((res) => {
          setTenants(res.data ?? [])
        })
        .catch(() => {})
    }
  }, [isPlatformAdmin])

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
        groupId: initialValues.groupId,
        roleIds: initialValues.roleIds ?? [],
        tenantId: initialValues.tenantId,
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
        groupId: undefined,
        roleIds: [],
        tenantId: undefined,
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
        <Label>{t('user.group')}</Label>
        <div className="max-h-48 overflow-y-auto rounded-lg border p-2">
          {groupTree.length > 0 ? (
            <GroupTreeRadio
              nodes={groupTree}
              selectedId={groupIdValue}
              onChange={(id) => setValue('groupId', id)}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">{t('common.noData')}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('user.role')}</Label>
        <div className="max-h-48 overflow-y-auto rounded-lg border p-2">
          {roles.length > 0 ? (
            <RoleCheckboxList
              roles={roles}
              selectedIds={roleIdsValue}
              onChange={(ids) => setValue('roleIds', ids)}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">{t('common.noData')}</p>
          )}
        </div>
      </div>

      {isPlatformAdmin && (
        <div className="space-y-2">
          <Label>{t('user.tenant')}</Label>
          <Controller
            control={control}
            name="tenantId"
            render={({ field }) => (
              <Select
                value={field.value != null ? String(field.value) : ''}
                onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('user.tenantPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {tenants.length > 0 ? (
                    tenants.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      {t('common.noData')}
                    </p>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

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
