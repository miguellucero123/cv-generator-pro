/**
 * METGO_3D VIRTUALIZE - Internationalization Composable
 */

import { ref, computed } from 'vue'
import es from '../i18n/es'
import en from '../i18n/en'

const STORAGE_KEY = 'metgo3d-locale'
const locales = { es, en }
const availableLocales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
]

export function useI18n() {
  const currentLocale = ref(localStorage.getItem(STORAGE_KEY) || 'es')
  const translations = computed(() => locales[currentLocale.value] || es)

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations.value
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }
    if (typeof value !== 'string') return key
    return value.replace(/\{(\w+)\}/g, (_, p) => params[p] ?? _)
  }

  const setLocale = (code) => {
    if (!locales[code]) return
    currentLocale.value = code
    localStorage.setItem(STORAGE_KEY, code)
    document.documentElement.setAttribute('lang', code)
  }

  const toggleLocale = () => {
    const idx = availableLocales.findIndex((l) => l.code === currentLocale.value)
    setLocale(availableLocales[(idx + 1) % availableLocales.length].code)
  }

  return {
    locale: currentLocale,
    availableLocales,
    t,
    setLocale,
    toggleLocale
  }
}
