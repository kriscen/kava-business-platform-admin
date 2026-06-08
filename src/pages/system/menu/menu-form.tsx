import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysMenuDetailResponse } from '@/types'
import { menuApi } from '@/api/modules/menu'
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
  name: z.string().min(1, i18n.t('menu.namePlaceholder')),
  permission: z.string().optional(),
  pid: z.number().nullable().optional(),
  path: z.string().optional(),
  component: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().optional(),
  menuType: z.string(),
  visible: z.string().optional(),
  keepAlive: z.string().optional(),
  embedded: z.string().optional(),
})

export type MenuFormValues = z.infer<typeof schema>

interface MenuFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysMenuDetailResponse>
  onSubmit: (values: MenuFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

export function MenuForm({ initialValues, onSubmit, formRef }: MenuFormProps) {
  const { t } = useTranslation()
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      permission: '',
      pid: null,
      path: '',
      component: '',
      icon: '',
      sortOrder: 0,
      menuType: '0',
      visible: '0',
      keepAlive: '0',
      embedded: '0',
    },
  })

  const menuType = watch('menuType')

  useEffect(() => {
    menuApi.getTree().then((res) => {
      setTreeData((res.data ?? []) as unknown as TreeNode[])
    })
  }, [])

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        permission: initialValues.permission ?? '',
        pid: initialValues.pid ?? null,
        path: initialValues.path ?? '',
        component: initialValues.component ?? '',
        icon: initialValues.icon ?? '',
        sortOrder: initialValues.sortOrder ?? 0,
        menuType: initialValues.menuType ?? '0',
        visible: initialValues.visible ?? '0',
        keepAlive: initialValues.keepAlive ?? '0',
        embedded: initialValues.embedded ?? '0',
      })
    } else {
      reset({
        name: '',
        permission: '',
        pid: null,
        path: '',
        component: '',
        icon: '',
        sortOrder: 0,
        menuType: '0',
        visible: '0',
        keepAlive: '0',
        embedded: '0',
      })
    }
  }, [initialValues, reset])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      id="menu-form"
    >
      <div className="space-y-2">
        <Label>
          {t('menu.menuType')} <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="menuType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('menu.menuTypeMenu')}</SelectItem>
                <SelectItem value="1">{t('menu.menuTypeButton')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="menu-name">
          {t('menu.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="menu-name"
          placeholder={t('menu.namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t('menu.parentMenu')}</Label>
        <Controller
          control={control}
          name="pid"
          render={({ field }) => (
            <TreeSelect
              data={treeData}
              value={field.value ?? null}
              onChange={field.onChange}
              placeholder={t('menu.parentMenuPlaceholder')}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="menu-permission">{t('menu.permission')}</Label>
        <Input
          id="menu-permission"
          placeholder={t('menu.permissionPlaceholder')}
          {...register('permission')}
        />
      </div>

      {menuType === '0' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="menu-path">{t('menu.path')}</Label>
            <Input id="menu-path" placeholder={t('menu.pathPlaceholder')} {...register('path')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-component">{t('menu.component')}</Label>
            <Input
              id="menu-component"
              placeholder={t('menu.componentPlaceholder')}
              {...register('component')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="menu-icon">{t('menu.icon')}</Label>
              <Input id="menu-icon" placeholder={t('menu.iconPlaceholder')} {...register('icon')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="menu-sort">{t('menu.sortOrder')}</Label>
              <Input
                id="menu-sort"
                type="number"
                placeholder={t('menu.sortOrderPlaceholder')}
                {...register('sortOrder', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>{t('menu.visible')}</Label>
              <Controller
                control={control}
                name="visible"
                render={({ field }) => (
                  <Select value={field.value ?? '0'} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t('menu.visibleShow')}</SelectItem>
                      <SelectItem value="1">{t('menu.visibleHide')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('menu.keepAlive')}</Label>
              <Controller
                control={control}
                name="keepAlive"
                render={({ field }) => (
                  <Select value={field.value ?? '0'} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t('menu.keepAliveYes')}</SelectItem>
                      <SelectItem value="1">{t('menu.keepAliveNo')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('menu.embedded')}</Label>
              <Controller
                control={control}
                name="embedded"
                render={({ field }) => (
                  <Select value={field.value ?? '0'} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t('menu.embeddedNo')}</SelectItem>
                      <SelectItem value="1">{t('menu.embeddedYes')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </>
      )}
    </form>
  )
}
