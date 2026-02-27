<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-rocket"></i> Proyectos</h3>
    <div class="array-list">
      <div
        v-for="(proj, idx) in (data.proyectos || [])"
        :key="idx"
        class="array-item"
      >
        <div class="array-item__header">
          <span>{{ proj.nombre || 'Sin nombre' }}</span>
          <button type="button" class="btn-sm" @click="emit('remove', 'proyectos', idx)" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="form-grid">
          <FormField label="Nombre" :value="proj.nombre" @input="emit('update-array', 'proyectos', idx, 'nombre', $event)" />
          <FormField label="Descripción" type="textarea" :value="proj.descripcion" @input="emit('update-array', 'proyectos', idx, 'descripcion', $event)" />
          <FormField label="URL" :value="proj.url" @input="emit('update-array', 'proyectos', idx, 'url', $event)" placeholder="https://..." />
          <FormField label="GitHub" :value="proj.github" @input="emit('update-array', 'proyectos', idx, 'github', $event)" placeholder="https://github.com/..." />
        </div>
      </div>
      <button type="button" class="btn-add" @click="addProject">
        <i class="fas fa-plus"></i> Agregar proyecto
      </button>
    </div>
  </div>
</template>

<script setup>
import FormField from '../ui/FormField.vue'
defineProps({ data: { type: Object, required: true } })
const emit = defineEmits(['update', 'update-array', 'add', 'remove', 'move'])

const addProject = () => {
  emit('add', 'proyectos', {
    nombre: '',
    descripcion: '',
    tecnologias: [],
    url: '',
    github: ''
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
