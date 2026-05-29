import { useAuthStore } from '@/stores/authStore'

const TenantProfile: React.FC = () => {
  const { userInfo } = useAuthStore()

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-semibold">个人信息</h2>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">用户名：</span>
          {userInfo?.username || '-'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">角色：</span>
          租户管理员
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">租户编码：</span>
          {userInfo?.tenantCode || '-'}
        </p>
      </div>
    </div>
  )
}

export default TenantProfile
