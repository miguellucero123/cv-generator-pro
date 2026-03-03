<template>
  <aside class="cv-section control-panel" :class="{ collapsed: isCollapsed }">
    <!-- Toggle button -->
    <button class="btn-toggle" @click="$emit('toggle-panel')" :title="isCollapsed ? 'Expandir panel' : 'Colapsar panel'">
      <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </button>

    <template v-if="!isCollapsed">
      <h2>{{ t ? t('panel.title') : 'Panel METGO_3D' }}</h2>
      <p class="control-panel__subtitle">
        {{ t ? t('panel.subtitle') : 'Vista preliminar del generador de CV. Edita en tiempo real con el editor.' }}
      </p>

      <button class="btn-editor" @click="$emit('toggle-editor')">
        <i :class="isEditing ? 'fas fa-eye' : 'fas fa-edit'"></i>
        {{ t ? (isEditing ? t('panel.viewCv') : t('panel.editCv')) : (isEditing ? 'Ver CV' : 'Editar CV') }}
      </button>

      <button class="btn-presentation" @click="$emit('start-presentation')">
        <i class="fas fa-desktop"></i>
        {{ t ? t('panel.presentation') : 'Presentación' }}
      </button>

      <button
        v-if="showSaveCloud"
        class="btn-cloud"
        :disabled="isSavingCloud"
        @click="$emit('save-cloud')"
      >
        <i :class="isSavingCloud ? 'fas fa-spinner fa-spin' : 'fas fa-cloud-upload-alt'"></i>
        {{ isSavingCloud ? '...' : (t ? t('panel.saveCloud') : 'Guardar en la nube') }}
      </button>

      <button
        class="btn-pdf"
        :disabled="isGeneratingPdf"
        @click="$emit('export-pdf')"
      >
        <i :class="isGeneratingPdf ? 'fas fa-spinner fa-spin' : 'fas fa-file-pdf'"></i>
        {{ isGeneratingPdf ? '...' : (t ? t('panel.exportPdf') : 'Exportar PDF') }}
      </button>

      <div class="template-selector">
        <label>{{ t ? t('panel.template') : 'Plantilla' }}</label>
        <div class="template-options">
          <button
            v-for="tmpl in templates"
            :key="tmpl.id"
            :class="['template-btn', { active: currentTemplate === tmpl.id }]"
            @click="$emit('change-template', tmpl.id)"
          >
            {{ tmpl.label }}
          </button>
        </div>
      </div>

      <div class="control-panel__group">
        <h3>{{ t ? t('panel.profileSummary') : 'Resumen del perfil' }}</h3>
        <ul>
          <li><strong>{{ t ? t('panel.role') : 'Rol' }}:</strong> {{ cvData.personal?.titulo }}</li>
          <li><strong>{{ t ? t('panel.location') : 'Ubicación' }}:</strong> {{ cvData.personal?.ubicacion }}</li>
          <li><strong>{{ t ? t('panel.availability') : 'Disponibilidad' }}:</strong> {{ cvData.personal?.disponibilidad }}</li>
          <li><strong>{{ t ? t('panel.modality') : 'Modalidad' }}:</strong> {{ cvData.personal?.modalidad }}</li>
        </ul>
      </div>

      <div class="control-panel__group">
        <h3>{{ t ? t('panel.highlights') : 'Destacados' }}</h3>
        <ul>
          <li v-for="item in cvData.perfil?.destacados || []" :key="item">{{ item }}</li>
        </ul>
      </div>
    </template>

    <!-- Collapsed state - only icons -->
    <template v-else>
      <div class="collapsed-icons">
        <button class="icon-btn" @click="$emit('toggle-editor')" :title="t ? t('panel.editCv') : 'Editar CV'">
          <i :class="isEditing ? 'fas fa-eye' : 'fas fa-edit'"></i>
        </button>
        <button class="icon-btn" @click="$emit('start-presentation')" :title="t ? t('panel.presentation') : 'Presentación'">
          <i class="fas fa-desktop"></i>
        </button>
        <button v-if="showSaveCloud" class="icon-btn" :disabled="isSavingCloud" @click="$emit('save-cloud')" :title="t ? t('panel.saveCloud') : 'Guardar'">
          <i :class="isSavingCloud ? 'fas fa-spinner fa-spin' : 'fas fa-cloud-upload-alt'"></i>
        </button>
        <button class="icon-btn" :disabled="isGeneratingPdf" @click="$emit('export-pdf')" :title="t ? t('panel.exportPdf') : 'PDF'">
          <i :class="isGeneratingPdf ? 'fas fa-spinner fa-spin' : 'fas fa-file-pdf'"></i>
        </button>
      </div>
    </template>
  </aside>
</template>

<script setup>
defineProps({
  cvData: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  currentTemplate: { type: String, default: 'modern' },
  isGeneratingPdf: { type: Boolean, default: false },
  t: { type: Function, default: null },
  cvId: { type: String, default: null },
  isSavingCloud: { type: Boolean, default: false },
  showSaveCloud: { type: Boolean, default: false },
  isCollapsed: { type: Boolean, default: false }
})
defineEmits(['toggle-editor', 'export-pdf', 'change-template', 'start-presentation', 'save-cloud', 'toggle-panel'])

const templates = [
  { id: 'modern', label: 'Moderno' },
  { id: 'classic', label: 'Clásico' },
  { id: 'minimal', label: 'Minimal' }
]
</script>

<style scoped>
/* Toggle button */
.btn-toggle {
  position: absolute;
  top: 1rem;
  right: -12px;
  width: 24px;
  height: 24px;
  padding: 0;
  background: #00d4aa;
  color: #0f172a;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.btn-toggle:hover {
  filter: brightness(1.1);
}

/* Collapsed state */
.control-panel {
  position: relative;
  transition: all 0.3s ease;
}

.control-panel.collapsed {
  padding: 1rem 0.5rem;
}

.control-panel.collapsed h2,
.control-panel.collapsed .control-panel__subtitle,
.control-panel.collapsed .template-selector,
.control-panel.collapsed .control-panel__group {
  display: none;
}

.collapsed-icons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: 2rem;
}

.icon-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  background: #1e293b;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.icon-btn:hover:not(:disabled) {
  background: #334155;
  color: #00d4aa;
  border-color: #00d4aa;
}
.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-editor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background: #00d4aa;
  color: #0f172a;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-editor:hover {
  filter: brightness(1.1);
}
.btn-editor i {
  font-size: 1rem;
}

.btn-pdf {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  background: #334155;
  color: #e5e7eb;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-pdf:hover:not(:disabled) {
  background: #475569;
}
.btn-pdf:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-presentation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  background: #1e293b;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-presentation:hover { background: #334155; color: #00d4aa; }

.btn-cloud {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  background: #0f3460;
  color: #00d4aa;
  border: 1px solid #00d4aa;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-cloud:hover:not(:disabled) { filter: brightness(1.2); }
.btn-cloud:disabled { opacity: 0.7; cursor: not-allowed; }

.template-selector {
  margin-bottom: 1rem;
}
.template-selector label {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}
.template-options {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.template-btn {
  padding: 0.4rem 0.65rem;
  font-size: 0.8rem;
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
  border-radius: 0.35rem;
  cursor: pointer;
}
.template-btn:hover {
  color: #00d4aa;
  border-color: #00d4aa;
}
.template-btn.active {
  background: rgba(0, 212, 170, 0.15);
  color: #00d4aa;
  border-color: #00d4aa;
}
</style>
