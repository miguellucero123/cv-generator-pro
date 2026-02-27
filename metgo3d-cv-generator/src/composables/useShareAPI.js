/**
 * METGO_3D VIRTUALIZE - useShareAPI Composable
 * API para CVs compartidos (acceso público sin auth)
 */

import { ref, computed } from 'vue'
import { useAPI } from './useAPI'
import { mapBackendToFrontend } from '../utils/cvMapper'

export function useShareAPI() {
  const api = useAPI()
  const publicCV = ref(null)

  const loading = computed(() => api.loading.value)
  const error = computed(() => api.error.value)

  const getPublicCV = async (publicUrl, authToken = null) => {
    const headers = authToken ? { 'X-CV-Auth': authToken } : {}
    const res = await api.request(`/share/${publicUrl}`, { method: 'GET', headers })
    if (res?.data?.cv) {
      publicCV.value = res.data.cv
      return { ...res, data: { cv: res.data.cv, cvFrontend: mapBackendToFrontend(res.data.cv) } }
    }
    return res
  }

  const verifyPassword = async (publicUrl, password) => {
    const res = await api.post(`/share/${publicUrl}/verify`, { password })
    return res?.data?.token ?? null
  }

  const downloadPublicCV = async (publicUrl, authToken = null) => {
    const headers = authToken ? { 'X-CV-Auth': authToken } : {}
    const res = await api.request(`/share/${publicUrl}/download`, { method: 'GET', headers })
    return res?.data
  }

  const clearCV = () => {
    publicCV.value = null
  }

  return {
    publicCV,
    loading,
    error,
    getPublicCV,
    verifyPassword,
    downloadPublicCV,
    clearCV
  }
}
