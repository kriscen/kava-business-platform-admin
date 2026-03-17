import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import common from './locales/zh-CN/common.json'
import layout from './locales/zh-CN/layout.json'

const resources = {
  'zh-CN': {
    translation: {
      common,
      layout,
    },
  },
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