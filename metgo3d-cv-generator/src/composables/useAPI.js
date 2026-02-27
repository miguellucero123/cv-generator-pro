/**
 * METGO_3D VIRTUALIZE - useAPI Composable
 * Cliente HTTP base para la API del backend
 */

import { ref, readonly } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'metgo3d-api-token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

export function useAPI() {
  const loading = ref(false)
  const error = ref(null)

  const clearError = () => {
    error.value = null
  }

  const request = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null

    try {
      const token = getToken()
      const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`

      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        }
      }

      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body)
      }

      const response = await fetch(url, config)
      let data

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = { message: await response.text() }
      }

      if (!response.ok) {
        if (response.status === 401 && data?.code === 'TOKEN_EXPIRED') {
          setToken(null)
          window.location.href = '/?expired=1'
        }
        throw new Error(data?.message || data?.error || 'Error en la solicitud')
      }

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const get = (endpoint) => request(endpoint, { method: 'GET' })
  const post = (endpoint, body) => request(endpoint, { method: 'POST', body })
  const put = (endpoint, body) => request(endpoint, { method: 'PUT', body })
  const patch = (endpoint, body) => request(endpoint, { method: 'PATCH', body })
  const del = (endpoint) => request(endpoint, { method: 'DELETE' })

  return {
    loading: readonly(loading),
    error: readonly(error),
    clearError,
    request,
    get,
    post,
    put,
    patch,
    del,
    apiUrl: API_URL
  }
}
