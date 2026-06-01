import { useTranslation } from 'react-i18next'

const PlatformDashboard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-semibold">{t('dashboard.platformTitle')}</h2>
      <p className="text-muted-foreground">{t('dashboard.platformWelcome')}</p>
    </div>
  )
}

export default PlatformDashboard
