/**
 * METGO_3D VIRTUALIZE - LocalStorage Composable
 */

import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }

  const storedValue = ref(getStoredValue())

  const setValue = (value) => {
    try {
      storedValue.value = value
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  const removeValue = () => {
    try {
      storedValue.value = defaultValue
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  watch(
    storedValue,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === key) {
        storedValue.value = e.newValue ? JSON.parse(e.newValue) : defaultValue
      }
    })
  }

  return {
    storedValue,
    setValue,
    removeValue
  }
}

