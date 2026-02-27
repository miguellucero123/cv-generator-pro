/**
 * METGO_3D VIRTUALIZE - useAuthAPI Composable
 * API de autenticación
 */

import { ref, computed } from 'vue'
import { useAPI, getToken, setToken, isAuthenticated } from './useAPI'

export function useAuthAPI() {
  const api = useAPI()
  const user = ref(null)

  const isLoggedIn = computed(() => isAuthenticated())
  const loading = computed(() => api.loading.value)
  const error = computed(() => api.error.value)

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    if (res?.data?.token) setToken(res.data.token)
    if (res?.data?.user) user.value = res.data.user
    return res
  }

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    if (res?.data?.token) setToken(res.data.token)
    if (res?.data?.user) user.value = res.data.user
    return res
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setToken(null)
      user.value = null
    }
  }

  const getMe = async () => {
    const res = await api.get('/auth/me')
    if (res?.data?.user) user.value = res.data.user
    return res
  }

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data)
    if (res?.data?.user) user.value = res.data.user
    return res
  }

  const changePassword = async (data) => {
    const res = await api.put('/auth/password', data)
    if (res?.data?.token) setToken(res.data.token)
    return res
  }

  const forgotPassword = async (email) => {
    return api.post('/auth/forgot-password', { email })
  }

  const resetPassword = async (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password })
  }

  const initFromToken = () => {
    if (getToken() && !user.value) {
      getMe().catch(() => setToken(null))
    }
  }

  return {
    user,
    isLoggedIn,
    loading,
    error,
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    initFromToken,
    setToken,
    getToken
  }
}
