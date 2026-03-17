import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './i18n'
import { setupGlobalErrorHandlers } from '@/utils/errorHandler'
import App from './App'

// 设置全局错误监听
setupGlobalErrorHandlers()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)