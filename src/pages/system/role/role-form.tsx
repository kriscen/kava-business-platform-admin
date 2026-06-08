import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

import type { SysRoleDetailResponse } from '@/types'
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

const schema = z.object({
  roleName: z.string().min(1, i18n.t('role.roleNamePlaceholder')),
  roleCode: z.string().min(1, i18n.t('role.roleCodePlaceholder')),
  roleDesc: z.string().optional(),
  dsType: z.string().optional(),
  dsScope: z.string().optional(),
  menuIds: z.array(z.number()).optional(),
})

export type RoleFormValues = z.infer<typeof schema>

interface RoleFormProps {
  mode?: 'create' | 'edit'
  initialValues?: Partial<SysRoleDetailResponse> & { dsScope?: string }
  onSubmit: (values: RoleFormValues) => void
  formRef?: React.RefObject<HTMLFormElement | null>
}

const DS_TYPES = [
  { value: '0', label: 'role.dsTypeAll' },
  { value: '1', label: 'role.dsTypeCustom' },
  { value: '2', label: 'role.dsTypeDept' },
  { value: '3', label: 'role.dsTypeDeptAndBelow' },
]

interface MenuTreeNode {
  id: number
  name: string
  children?: MenuTreeNode[]
}

function MenuTreeCheckbox({
  nodes,
  selectedIds,
  onChange,
  depth = 0,
}: {
  nodes: MenuTreeNode[]
  selectedIds: Set<number>
  onChange: (ids: number[]) => void
  depth?: number
}) {
  const toggleNode = (id: number) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange(Array.from(next))
  }

  return (
    <div>
      {nodes.map((node) => (
        <div key={node.id} style={{ paddingLeft: `${depth * 16}px` }}>
          <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-accent rounded px-1">
            <input
              type="checkbox"
              checked={selectedIds.has(node.id)}
              onChange={() => toggleNode(node.id)}
              className="size-3.5 rounded border-input"
            />
            <span className="text-sm">{node.name}</span>
          </label>
          {node.children && node.children.length > 0 && (
            <MenuTreeCheckbox
              nodes={node.children}
              selectedIds={selectedIds}
              onChange={onChange}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function RoleForm({ initialValues, onSubmit, formRef }: RoleFormProps) {
  const { t } = useTranslation()
  const [menuTree, setMenuTree] = useState<MenuTreeNode[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleName: '',
      roleCode: '',
      roleDesc: '',
      dsType: '0',
      dsScope: '',
      menuIds: [],
    },
  })

  const dsTypeValue = watch('dsType')
  const menuIdsValue = watch('menuIds') ?? []

  useEffect(() => {
    menuApi.getTree().then((res) => {
      setMenuTree((res.data ?? []) as unknown as MenuTreeNode[])
    })
  }, [])

  useEffect(() => {
    if (initialValues) {
      reset({
        roleName: initialValues.roleName ?? '',
        roleCode: initialValues.roleCode ?? '',
        roleDesc: initialValues.roleDesc ?? '',
        dsType: initialValues.dsType ?? '0',
        dsScope: initialValues.dsScope ?? '',
        menuIds: initialValues.menuIds ?? [],
      })
    } else {
      reset({ roleName: '', roleCode: '', roleDesc: '', dsType: '0', dsScope: '', menuIds: [] })
    }
  }, [initialValues, reset])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="role-form">
      <div className="space-y-2">
        <Label htmlFor="role-name">
          {t('role.roleName')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="role-name"
          placeholder={t('role.roleNamePlaceholder')}
          aria-invalid={!!errors.roleName}
          {...register('roleName')}
        />
        {errors.roleName && <p className="text-xs text-destructive">{errors.roleName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-code">
          {t('role.roleCode')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="role-code"
          placeholder={t('role.roleCodePlaceholder')}
          aria-invalid={!!errors.roleCode}
          {...register('roleCode')}
        />
        {errors.roleCode && <p className="text-xs text-destructive">{errors.roleCode.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-desc">{t('role.roleDesc')}</Label>
        <Input
          id="role-desc"
          placeholder={t('role.roleDescPlaceholder')}
          {...register('roleDesc')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('role.dsType')}</Label>
        <Controller
          control={control}
          name="dsType"
          render={({ field }) => (
            <Select value={field.value ?? '0'} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('role.dsTypePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {DS_TYPES.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {t(dt.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {dsTypeValue === '1' && (
        <div className="space-y-2">
          <Label htmlFor="role-dsScope">{t('role.dsScope')}</Label>
          <Input
            id="role-dsScope"
            placeholder={t('role.dsScopePlaceholder')}
            {...register('dsScope')}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>{t('role.menuIds')}</Label>
        <div className="max-h-48 overflow-y-auto rounded-lg border p-2">
          {menuTree.length > 0 ? (
            <MenuTreeCheckbox
              nodes={menuTree}
              selectedIds={new Set(menuIdsValue)}
              onChange={(ids) => setValue('menuIds', ids)}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">{t('common.noData')}</p>
          )}
        </div>
      </div>
    </form>
  )
}
