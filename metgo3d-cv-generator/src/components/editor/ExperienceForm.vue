<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-briefcase"></i> Experiencia Laboral</h3>
    <div class="array-list">
      <div
        v-for="(exp, idx) in (data.experiencia || [])"
        :key="idx"
        class="array-item"
      >
        <div class="array-item__header">
          <span>{{ exp.cargo || 'Sin cargo' }} · {{ exp.empresa || '' }}</span>
          <button type="button" class="btn-sm" @click="emit('remove', 'experiencia', idx)" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="form-grid">
          <FormField label="Cargo" :value="exp.cargo" @input="emit('update-array', 'experiencia', idx, 'cargo', $event)" />
          <FormField label="Empresa" :value="exp.empresa" @input="emit('update-array', 'experiencia', idx, 'empresa', $event)" />
          <FormField label="Proyecto" :value="exp.proyecto" @input="emit('update-array', 'experiencia', idx, 'proyecto', $event)" placeholder="Opcional" />
          <FormField label="Ubicación" :value="exp.ubicacion" @input="emit('update-array', 'experiencia', idx, 'ubicacion', $event)" />
          <FormField label="Período" :value="exp.periodo" @input="emit('update-array', 'experiencia', idx, 'periodo', $event)" placeholder="Ej: Ene 2020 - Dic 2023" />
          <FormField label="Industria" :value="exp.industria" @input="emit('update-array', 'experiencia', idx, 'industria', $event)" placeholder="Ej: Minería / Tecnología" />
        </div>
      </div>
      <button type="button" class="btn-add" @click="addExperience">
        <i class="fas fa-plus"></i> Agregar experiencia
      </button>
    </div>
  </div>
</template>

<script setup>
import FormField from '../ui/FormField.vue'
defineProps({ data: { type: Object, required: true } })
const emit = defineEmits(['update', 'update-array', 'add', 'remove', 'move'])

const addExperience = () => {
  emit('add', 'experiencia', {
    cargo: '',
    empresa: '',
    proyecto: null,
    ubicacion: '',
    periodo: '',
    duracion: '',
    industria: '',
    logros: [],
    tecnologias: [],
    destacado: false
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
