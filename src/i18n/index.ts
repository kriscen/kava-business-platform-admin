import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const zhCNModules = import.meta.glob<{ default: Record<string, string> }>(
  './locales/zh-CN/*.json',
  { eager: true }
)

const translation: Record<string, Record<string, string>> = {}

for (const path of Object.keys(zhCNModules)) {
  const fileName = path.match(/([^/]+)\.json$/)?.[1]
  if (fileName) {
    translation[fileName] = zhCNModules[path].default
  }
}

const resources = {
  'zh-CN': { translation },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
