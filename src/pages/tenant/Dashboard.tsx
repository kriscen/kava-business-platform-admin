import { useTranslation } from 'react-i18next'

const TenantDashboard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-semibold">{t('dashboard.tenantTitle')}</h2>
      <p className="text-muted-foreground">{t('dashboard.tenantWelcome')}</p>
    </div>
  )
}

export default TenantDashboard
