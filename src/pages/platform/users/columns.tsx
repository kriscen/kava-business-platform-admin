import type { SysUserListResponse } from '@/types'
import type { DataTableColumn } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ColumnsConfig {
  onEdit: (row: SysUserListResponse) => void
  onDelete: (row: SysUserListResponse) => void
}

export function getUserColumns({
  onEdit,
  onDelete,
}: ColumnsConfig): DataTableColumn<SysUserListResponse>[] {
  return [
    { key: 'username', title: '用户名' },
    { key: 'nickname', title: '昵称' },
    { key: 'phone', title: '手机号' },
    { key: 'email', title: '邮箱' },
    { key: 'deptName', title: '部门' },
    {
      key: 'lockFlag',
      title: '状态',
      render: (val) => (
        <Badge variant={val === '0' ? 'default' : 'destructive'}>
          {val === '0' ? '正常' : '锁定'}
        </Badge>
      ),
    },
    { key: 'gmtCreate', title: '创建时间' },
    {
      key: 'id',
      title: '操作',
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => onEdit(row)}>
            编辑
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive"
            onClick={() => onDelete(row)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]
}
