/**
 * METGO_3D VIRTUALIZE - LocalStorage Composable
 */

import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // Modo general (sin key) para tests y uso genérico
  if (key === undefined) {
    const setItem = (k, value) => {
      try {
        localStorage.setItem(k, JSON.stringify(value))
      } catch (error) {
        console.error('Error writing to localStorage:', error)
      }
    }

    const getItem = (k) => {
      try {
        const item = localStorage.getItem(k)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        return null
      }
    }

    const removeItem = (k) => {
      try {
        localStorage.removeItem(k)
      } catch (error) {
        console.error('Error removing from localStorage:', error)
      }
    }

    const clear = () => {
      try {
        localStorage.clear()
      } catch (error) {
        console.error('Error clearing localStorage:', error)
      }
    }

    return {
      setItem,
      getItem,
      removeItem,
      clear
    }
  }

  // Modo específico (con key) - comportamiento original para uso en app
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
