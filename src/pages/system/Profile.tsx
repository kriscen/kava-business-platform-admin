import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

const TenantProfile: React.FC = () => {
  const { t } = useTranslation()
  const { userInfo } = useAuthStore()

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-semibold">{t('profile.title')}</h2>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{t('profile.username')}</span>
          {userInfo?.username || '-'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{t('profile.role')}</span>
          {t('profile.tenantAdmin')}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{t('profile.tenantCode')}</span>
          {userInfo?.tenantCode || '-'}
        </p>
      </div>
    </div>
  )
}

export default TenantProfile
