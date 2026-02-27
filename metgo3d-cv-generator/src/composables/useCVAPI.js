/**
 * METGO_3D VIRTUALIZE - useCVAPI Composable
 * API de CVs con mapeo entre formatos frontend y backend
 */

import { ref, computed } from 'vue'
import { useAPI } from './useAPI'
import { mapBackendToFrontend, mapFrontendToBackend } from '../utils/cvMapper'

export function useCVAPI() {
  const api = useAPI()
  const cvs = ref([])

  const loading = computed(() => api.loading.value)
  const error = computed(() => api.error.value)

  const getCVs = async (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    const res = await api.get(`/cvs${qs ? `?${qs}` : ''}`)
    if (res?.data?.cvs) cvs.value = res.data.cvs
    return res
  }

  const getCV = async (id, asFrontend = false) => {
    const res = await api.get(`/cvs/${id}`)
    if (asFrontend && res?.data?.cv) {
      return { ...res, data: { cv: mapBackendToFrontend(res.data.cv), raw: res.data.cv } }
    }
    return res
  }

  const createCV = async (cvData, isFrontendFormat = true) => {
    const body = isFrontendFormat ? mapFrontendToBackend(cvData) : cvData
    return api.post('/cvs', body)
  }

  const updateCV = async (id, cvData, isFrontendFormat = true) => {
    const body = isFrontendFormat ? mapFrontendToBackend(cvData) : cvData
    return api.put(`/cvs/${id}`, body)
  }

  const deleteCV = async (id) => {
    const res = await api.del(`/cvs/${id}`)
    cvs.value = cvs.value.filter((c) => c._id !== id)
    return res
  }

  const cloneCV = async (id) => {
    const res = await api.post(`/cvs/${id}/clone`)
    if (res?.data?.cv) cvs.value.unshift(res.data.cv)
    return res
  }

  const exportCV = async (id, asFrontendFormat = false) => {
    const res = await api.get(`/cvs/${id}/export`)
    if (asFrontendFormat && res?.data) {
      return { ...res, data: mapBackendToFrontend(res.data) }
    }
    return res
  }

  const importCV = async (cvData) => {
    const body = cvData.personal || cvData.personalInfo ? cvData : { ...cvData, personal: cvData }
    return api.post('/cvs/import', body)
  }

  const getShareSettings = async (id) => {
    return api.get(`/cvs/${id}/share`)
  }

  const updateShareSettings = async (id, data) => {
    return api.put(`/cvs/${id}/share`, data)
  }

  const regenerateShareUrl = async (id) => {
    return api.post(`/cvs/${id}/share/regenerate-url`)
  }

  return {
    cvs,
    loading,
    error,
    getCVs,
    getCV,
    createCV,
    updateCV,
    deleteCV,
    cloneCV,
    exportCV,
    importCV,
    getShareSettings,
    updateShareSettings,
    regenerateShareUrl,
    mapBackendToFrontend,
    mapFrontendToBackend
  }
}
