import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export default function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userInfo } = useAuthStore()

  const goHome = () => {
    const path = userInfo?.role === 'tenant_admin' ? '/tenant/dashboard' : '/platform/dashboard'
    navigate(path)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-6xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="mb-2 text-xl font-semibold">{t('common.notFoundTitle')}</h2>
        <p className="mb-6 text-muted-foreground">{t('common.notFoundDescription')}</p>
        <Button onClick={goHome}>{t('common.backToHome')}</Button>
      </div>
    </div>
  )
}
