<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-graduation-cap"></i> Educación</h3>
    <div class="array-list">
      <div
        v-for="(edu, idx) in (data.educacion || [])"
        :key="idx"
        class="array-item"
      >
        <div class="array-item__header">
          <span>{{ edu.titulo || 'Sin título' }}</span>
          <div class="array-item__actions">
            <button type="button" class="btn-sm" @click="emit('remove', 'educacion', idx)" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="form-grid">
          <FormField label="Título" :value="edu.titulo" @input="emit('update-array', 'educacion', idx, 'titulo', $event)" />
          <FormField label="Institución" :value="edu.institucion" @input="emit('update-array', 'educacion', idx, 'institucion', $event)" />
          <FormField label="Período" :value="edu.periodo" @input="emit('update-array', 'educacion', idx, 'periodo', $event)" placeholder="Ej: 2020 - 2024" />
          <FormField label="Estado" type="select" :value="edu.estado" @input="emit('update-array', 'educacion', idx, 'estado', $event)" :options="estadoOptions" />
          <FormField label="Descripción" type="textarea" :value="edu.descripcion" @input="emit('update-array', 'educacion', idx, 'descripcion', $event)" />
        </div>
      </div>
      <button type="button" class="btn-add" @click="addEducation">
        <i class="fas fa-plus"></i> Agregar formación
      </button>
    </div>
  </div>
</template>

<script setup>
import FormField from '../ui/FormField.vue'
defineProps({ data: { type: Object, required: true } })
const emit = defineEmits(['update', 'update-array', 'add', 'remove', 'move'])

const estadoOptions = [
  { value: 'Egresado', label: 'Egresado' },
  { value: 'En curso', label: 'En curso' },
  { value: 'Titulado', label: 'Titulado' },
  { value: 'Completado', label: 'Completado' },
  { value: 'Licenciado', label: 'Licenciado' }
]

const addEducation = () => {
  emit('add', 'educacion', {
    titulo: '',
    institucion: '',
    periodo: '',
    estado: 'Egresado',
    descripcion: ''
  })
}
</script>

<style scoped>
.form-section { padding: 1rem; }
.form-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #e5e7eb;
}
.form-section-title i { color: #00d4aa; }
.array-list { display: flex; flex-direction: column; gap: 1rem; }
.array-item {
  padding: 1rem;
  background: #1e293b;
  border-radius: 0.5rem;
  border: 1px solid #334155;
}
.array-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #e5e7eb;
}
.array-item__actions { display: flex; gap: 0.25rem; }
.btn-sm {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: transparent;
  border: 1px solid #475569;
  border-radius: 0.25rem;
  color: #94a3b8;
  cursor: pointer;
}
.btn-sm:hover { color: #ef4444; border-color: #ef4444; }
.form-grid { display: flex; flex-direction: column; gap: 0; }
.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed #475569;
  border-radius: 0.5rem;
  color: #94a3b8;
  cursor: pointer;
}
.btn-add:hover { border-color: #00d4aa; color: #00d4aa; }
</style>
