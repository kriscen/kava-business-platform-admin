import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { userInfo } = useAuthStore()
  const isTenant = userInfo?.role === 'tenant_admin'

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-semibold">
        {t(isTenant ? 'dashboard.tenantTitle' : 'dashboard.platformTitle')}
      </h2>
      <p className="text-muted-foreground">
        {t(isTenant ? 'dashboard.tenantWelcome' : 'dashboard.platformWelcome')}
      </p>
    </div>
  )
}

export default Dashboard
