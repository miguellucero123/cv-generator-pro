<template>
  <aside class="cv-section control-panel">
    <h2>Panel METGO_3D</h2>
    <p class="control-panel__subtitle">
      Vista preliminar del generador de CV. Edita en tiempo real con el editor.
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
      <label>Plantilla</label>
      <div class="template-options">
        <button
          v-for="t in templates"
          :key="t.id"
          :class="['template-btn', { active: currentTemplate === t.id }]"
          @click="$emit('change-template', t.id)"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <div class="control-panel__group">
      <h3>Resumen del perfil</h3>
      <ul>
        <li><strong>Rol:</strong> {{ cvData.personal?.titulo }}</li>
        <li><strong>Ubicación:</strong> {{ cvData.personal?.ubicacion }}</li>
        <li><strong>Disponibilidad:</strong> {{ cvData.personal?.disponibilidad }}</li>
        <li><strong>Modalidad:</strong> {{ cvData.personal?.modalidad }}</li>
      </ul>
    </div>

    <div class="control-panel__group">
      <h3>Destacados</h3>
      <ul>
        <li v-for="item in cvData.perfil?.destacados || []" :key="item">{{ item }}</li>
      </ul>
    </div>
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
  showSaveCloud: { type: Boolean, default: false }
})
defineEmits(['toggle-editor', 'export-pdf', 'change-template', 'start-presentation', 'save-cloud'])

const templates = [
  { id: 'modern', label: 'Moderno' },
  { id: 'classic', label: 'Clásico' },
  { id: 'minimal', label: 'Minimal' }
]
</script>

<style scoped>
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
