<template>
  <div class="cv-editor" :class="{ 'is-open': isOpen }">
    <div class="editor-header">
      <div class="editor-title">
        <i class="fas fa-edit"></i>
        <h2>Editor de CV</h2>
        <span class="completion-badge" :class="completionClass">{{ completionPercentage }}% completo</span>
      </div>
      <div class="editor-actions">
        <button class="btn-icon" @click="$emit('undo')" :disabled="!canUndo" title="Deshacer"><i class="fas fa-undo"></i></button>
        <button class="btn-icon" @click="$emit('redo')" :disabled="!canRedo" title="Rehacer"><i class="fas fa-redo"></i></button>
        <span class="divider"></span>
        <button class="btn-icon" @click="$emit('export')" title="Exportar JSON"><i class="fas fa-download"></i></button>
        <label class="btn-icon" title="Importar JSON">
          <i class="fas fa-upload"></i>
          <input type="file" accept=".json" @change="handleImport" style="display: none" />
        </label>
        <span class="divider"></span>
        <button class="btn-icon danger" @click="$emit('reset')" title="Restaurar"><i class="fas fa-trash-restore"></i></button>
        <button class="btn-icon" @click="$emit('close')" title="Cerrar"><i class="fas fa-times"></i></button>
      </div>
    </div>

    <EditorTabs :tabs="tabs" :active-tab="activeTab" @change="$emit('set-tab', $event)" />

    <div class="editor-content">
      <transition name="fade" mode="out-in">
        <component
          :is="currentFormComponent"
          :data="cvData"
          @update="(s, f, v) => emit('update', s, f, v)"
          @update-array="(s, i, f, v) => emit('update-array', s, i, f, v)"
          @add="(s, item) => emit('add', s, item)"
          @remove="(s, i) => emit('remove', s, i)"
          @move="(s, from, to) => emit('move', s, from, to)"
        />
      </transition>
    </div>

    <div class="editor-footer">
      <div class="save-status">
        <template v-if="isSaving">
          <LoadingSpinner size="sm" />
          <span>Guardando...</span>
        </template>
        <template v-else-if="lastSaved">
          <i class="fas fa-check-circle success"></i>
          <span>Guardado {{ formatTime(lastSaved) }}</span>
        </template>
        <template v-else-if="hasChanges">
          <i class="fas fa-circle warning"></i>
          <span>Cambios sin guardar</span>
        </template>
      </div>
      <div class="footer-actions">
        <button class="btn btn-secondary" @click="$emit('close')">Cerrar</button>
        <button class="btn btn-primary" @click="$emit('save')" :disabled="!hasChanges || isSaving">
          <i class="fas fa-save"></i> Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EditorTabs from './EditorTabs.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import PersonalForm from './PersonalForm.vue'
import ProfileForm from './ProfileForm.vue'
import SkillsForm from './SkillsForm.vue'
import EducationForm from './EducationForm.vue'
import ExperienceForm from './ExperienceForm.vue'
import ProjectsForm from './ProjectsForm.vue'
import AdditionalForm from './AdditionalForm.vue'

const props = defineProps({
  isOpen: Boolean,
  cvData: Object,
  tabs: Array,
  activeTab: String,
  hasChanges: Boolean,
  isSaving: Boolean,
  lastSaved: [Date, Object],
  canUndo: Boolean,
  canRedo: Boolean,
  completionPercentage: Number
})

const emit = defineEmits(['close', 'save', 'update', 'update-array', 'add', 'remove', 'move', 'undo', 'redo', 'reset', 'export', 'import', 'set-tab'])

const formComponents = {
  personal: PersonalForm,
  profile: ProfileForm,
  skills: SkillsForm,
  education: EducationForm,
  experience: ExperienceForm,
  projects: ProjectsForm,
  additional: AdditionalForm
}

const currentFormComponent = computed(() => formComponents[props.activeTab] || PersonalForm)

const completionClass = computed(() => {
  const p = props.completionPercentage
  if (p >= 80) return 'high'
  if (p >= 50) return 'medium'
  return 'low'
})

const formatTime = (date) => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'hace un momento'
  if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} min`
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

const handleImport = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    emit('import', file)
    e.target.value = ''
  }
}
</script>

<style scoped>
.cv-editor {
  position: fixed;
  top: 0;
  right: -520px;
  width: 500px;
  max-width: 100%;
  height: 100vh;
  background: #0f172a;
  border-left: 1px solid #334155;
  box-shadow: -8px 0 24px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: right 0.3s ease;
}
.cv-editor.is-open { right: 0; }

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #334155;
  background: #1e293b;
}
.editor-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.editor-title h2 { font-size: 1rem; margin: 0; }
.editor-title i { color: #00d4aa; }
.completion-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
}
.completion-badge.high { background: rgba(34,197,94,0.2); color: #22c55e; }
.completion-badge.medium { background: rgba(234,179,8,0.2); color: #eab308; }
.completion-badge.low { background: rgba(239,68,68,0.2); color: #ef4444; }

.editor-actions { display: flex; align-items: center; gap: 0.25rem; }
.btn-icon {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: transparent;
  border: 1px solid #334155;
  border-radius: 0.375rem;
  color: #94a3b8;
  cursor: pointer;
}
.btn-icon:hover:not(:disabled) { color: #00d4aa; border-color: #00d4aa; }
.btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-icon.danger:hover { color: #ef4444; border-color: #ef4444; }
.divider { width: 1px; height: 20px; background: #334155; margin: 0 0.25rem; }

.editor-content {
  flex: 1;
  overflow-y: auto;
}

.editor-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.save-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #94a3b8; }
.save-status .success { color: #22c55e; }
.save-status .warning { color: #eab308; font-size: 6px; }
.footer-actions { display: flex; gap: 0.5rem; }
.btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-secondary { background: #334155; color: #e5e7eb; border: none; }
.btn-primary { background: #00d4aa; color: #0f172a; border: none; }
.btn-primary:hover:not(:disabled) { filter: brightness(1.1); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .cv-editor { width: 100%; right: -100%; }
  .cv-editor.is-open { right: 0; }
}
</style>
