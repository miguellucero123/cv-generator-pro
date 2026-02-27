<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-id-card"></i> Perfil Profesional</h3>
    <div class="form-grid">
      <FormField label="Resumen" type="textarea" :value="data.perfil?.resumen" @input="update('perfil', 'resumen', $event)" placeholder="Resumen profesional..." required />
      <FormField label="Propuesta de valor" type="textarea" :value="data.perfil?.propuestaValor" @input="update('perfil', 'propuestaValor', $event)" placeholder="Propuesta de valor..." />
    </div>
    <p class="form-hint">Los destacados se editan en una versión posterior.</p>
  </div>
</template>

<script setup>
import FormField from '../ui/FormField.vue'
defineProps({ data: { type: Object, required: true } })
const emit = defineEmits(['update'])
const update = (section, field, value) => emit('update', section, field, value)
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
.form-hint { font-size: 0.8rem; color: #64748b; margin-top: 0.5rem; }
</style>
