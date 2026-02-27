/**
 * METGO_3D VIRTUALIZE - Editor Composable
 * Maneja el estado y lógica del editor de CV
 */

import { ref, reactive, computed, watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { cvData as defaultCvData } from '../data/cvData'

const STORAGE_KEY = 'metgo3d-cv-data'

export function useEditor() {
  const { storedValue, setValue } = useLocalStorage(STORAGE_KEY, null)

  const initial = storedValue.value
    ? JSON.parse(JSON.stringify(storedValue.value))
    : JSON.parse(JSON.stringify(defaultCvData))
  if (!initial.proyectos) initial.proyectos = []
  const cvData = reactive(initial)
  const isEditing = ref(false)
  const activeTab = ref('personal')
  const hasChanges = ref(false)
  const isSaving = ref(false)
  const lastSaved = ref(null)

  const history = ref([])
  const historyIndex = ref(-1)
  const maxHistorySize = 50

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: 'fas fa-user' },
    { id: 'profile', label: 'Perfil', icon: 'fas fa-id-card' },
    { id: 'skills', label: 'Competencias', icon: 'fas fa-cogs' },
    { id: 'education', label: 'Educación', icon: 'fas fa-graduation-cap' },
    { id: 'experience', label: 'Experiencia', icon: 'fas fa-briefcase' },
    { id: 'projects', label: 'Proyectos', icon: 'fas fa-rocket' },
    { id: 'additional', label: 'Adicional', icon: 'fas fa-info-circle' }
  ]

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const completionPercentage = computed(() => calculateCompletion())

  const toggleEditor = () => {
    isEditing.value = !isEditing.value
  }

  const setActiveTab = (tabId) => {
    activeTab.value = tabId
  }

  const updateField = (section, field, value) => {
    saveToHistory()

    if (field.includes('.')) {
      const keys = field.split('.')
      let target = cvData[section]
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]]
      }
      target[keys[keys.length - 1]] = value
    } else {
      cvData[section][field] = value
    }

    hasChanges.value = true
  }

  const updateArrayItem = (section, index, field, value) => {
    saveToHistory()

    if (field) {
      cvData[section][index][field] = value
    } else {
      cvData[section][index] = value
    }

    hasChanges.value = true
  }

  const addArrayItem = (section, item) => {
    saveToHistory()
    cvData[section].push(item)
    hasChanges.value = true
  }

  const removeArrayItem = (section, index) => {
    saveToHistory()
    cvData[section].splice(index, 1)
    hasChanges.value = true
  }

  const moveArrayItem = (section, fromIndex, toIndex) => {
    saveToHistory()
    const item = cvData[section].splice(fromIndex, 1)[0]
    cvData[section].splice(toIndex, 0, item)
    hasChanges.value = true
  }

  const saveToHistory = () => {
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(JSON.stringify(cvData))

    if (history.value.length > maxHistorySize) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--
      const previousState = JSON.parse(history.value[historyIndex.value])
      Object.assign(cvData, previousState)
      hasChanges.value = true
    }
  }

  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++
      const nextState = JSON.parse(history.value[historyIndex.value])
      Object.assign(cvData, nextState)
      hasChanges.value = true
    }
  }

  const saveChanges = async () => {
    isSaving.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setValue(JSON.parse(JSON.stringify(cvData)))

      hasChanges.value = false
      lastSaved.value = new Date()

      return true
    } catch (error) {
      console.error('Error saving changes:', error)
      return false
    } finally {
      isSaving.value = false
    }
  }

  const resetToDefault = () => {
    if (
      confirm(
        '¿Estás seguro de que deseas restaurar los datos por defecto? Se perderán todos los cambios.'
      )
    ) {
      saveToHistory()
      Object.assign(cvData, JSON.parse(JSON.stringify(defaultCvData)))
      hasChanges.value = true
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(cvData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `cv-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const loadCvData = (data) => {
    saveToHistory()
    const merged = JSON.parse(JSON.stringify(data))
    if (!merged.proyectos) merged.proyectos = []
    Object.assign(cvData, merged)
    setValue(JSON.parse(JSON.stringify(cvData)))
    hasChanges.value = false
  }

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          saveToHistory()
          Object.assign(cvData, importedData)
          hasChanges.value = true
          resolve(true)
        } catch (error) {
          reject(new Error('Archivo JSON inválido'))
        }
      }

      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsText(file)
    })
  }

  const calculateCompletion = () => {
    let completed = 0
    let total = 0

    const personalFields = [
      'nombre',
      'titulo',
      'email',
      'telefono',
      'ubicacion',
      'linkedin',
      'github',
      'website'
    ]
    personalFields.forEach((field) => {
      total++
      if (cvData.personal[field]) completed++
    })

    total += 2
    if (cvData.perfil.resumen) completed++
    if (cvData.perfil.propuestaValor) completed++

    total += 4
    if (cvData.competencias.programacion?.skills?.length > 0) completed++
    if (cvData.competencias.datascience?.skills?.length > 0) completed++
    if (cvData.competencias.herramientas?.skills?.length > 0) completed++
    if (cvData.competencias.soft?.skills?.length > 0) completed++

    total++
    if (cvData.educacion?.length > 0) completed++

    total++
    if (cvData.experiencia?.length > 0) completed++

    total++
    if (cvData.proyectos?.length > 0) completed++

    return Math.round((completed / total) * 100)
  }

  watch(hasChanges, (newValue) => {
    if (newValue) {
      const timeoutId = setTimeout(() => {
        saveChanges()
      }, 3000)

      return () => clearTimeout(timeoutId)
    }
  })

  history.value.push(JSON.stringify(cvData))
  historyIndex.value = 0

  // Helper functions for test compatibility
  const updatePersonalInfo = (info) => {
    Object.keys(info).forEach((key) => {
      updateField('personal', key, info[key])
    })
  }

  const addExperience = (experience) => {
    addArrayItem('experiencia', experience)
  }

  const removeExperience = (index) => {
    removeArrayItem('experiencia', index)
  }

  const addEducation = (education) => {
    addArrayItem('educacion', education)
  }

  const removeEducation = (index) => {
    removeArrayItem('educacion', index)
  }

  const addSkill = (skill, category = 'programacion') => {
    if (!cvData.competencias[category]) {
      cvData.competencias[category] = { skills: [] }
    }
    if (!cvData.competencias[category].skills) {
      cvData.competencias[category].skills = []
    }
    cvData.competencias[category].skills.push(skill)
    hasChanges.value = true
  }

  const removeSkill = (skill, category = 'programacion') => {
    if (cvData.competencias[category]?.skills) {
      const index = cvData.competencias[category].skills.findIndex((s) => s === skill)
      if (index !== -1) {
        cvData.competencias[category].skills.splice(index, 1)
        hasChanges.value = true
      }
    }
  }

  const setTemplate = (template) => {
    cvData.template = template
    hasChanges.value = true
  }

  const saveCV = async () => {
    return await saveChanges()
  }

  const resetCV = () => {
    resetToDefault()
  }

  return {
    cvData,
    isEditing,
    activeTab,
    hasChanges,
    isSaving,
    lastSaved,
    tabs,
    canUndo,
    canRedo,
    completionPercentage,
    toggleEditor,
    setActiveTab,
    updateField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    moveArrayItem,
    undo,
    redo,
    saveChanges,
    resetToDefault,
    exportData,
    importData,
    loadCvData,
    // Test-compatible API
    updatePersonalInfo,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    setTemplate,
    saveCV,
    resetCV
  }
}

