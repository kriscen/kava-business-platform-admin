import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
  username: z.string().min(1, '请输入用户名'),
  password: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
  nickname: z.string().optional(),
  name: z.string().optional(),
  lockFlag: z.string().optional(),
})

export function getUserFormSchema(mode: 'create' | 'edit') {
  if (mode === 'create') {
    return baseSchema.refine((data) => data.password && data.password.length > 0, {
      message: '请输入密码',
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
          用户名 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="username"
          placeholder="请输入用户名"
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
      </div>

      {mode === 'create' && (
        <div className="space-y-2">
          <Label htmlFor="password">
            密码 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="请输入密码"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">手机号</Label>
          <Input id="phone" placeholder="请输入手机号" {...register('phone')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            placeholder="请输入邮箱"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nickname">昵称</Label>
          <Input id="nickname" placeholder="请输入昵称" {...register('nickname')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">姓名</Label>
          <Input id="name" placeholder="请输入姓名" {...register('name')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>状态</Label>
        <Controller
          control={control}
          name="lockFlag"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">正常</SelectItem>
                <SelectItem value="9">锁定</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </form>
  )
}
