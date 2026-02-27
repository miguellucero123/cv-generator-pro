<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-user"></i> Información Personal</h3>
    <div class="form-grid">
      <FormField label="Nombre Completo" :value="data.personal?.nombre" @input="update('personal', 'nombre', $event)" placeholder="Ej: Miguel Lucero Gatica" required />
      <FormField label="Título Profesional" :value="data.personal?.titulo" @input="update('personal', 'titulo', $event)" placeholder="Ej: Analista de Datos" required />
      <FormField label="Subtítulo" :value="data.personal?.subtitulo" @input="update('personal', 'subtitulo', $event)" placeholder="Ej: Meteorólogo" />
      <FormField label="Email" type="email" :value="data.personal?.email" @input="update('personal', 'email', $event)" placeholder="correo@ejemplo.com" required />
      <FormField label="Teléfono" type="tel" :value="data.personal?.telefono" @input="update('personal', 'telefono', $event)" placeholder="+56 9 1234 5678" required />
      <FormField label="Ubicación" :value="data.personal?.ubicacion" @input="update('personal', 'ubicacion', $event)" placeholder="Ciudad, Región" required />
      <FormField label="LinkedIn" type="url" :value="data.personal?.linkedinUrl" @input="update('personal', 'linkedinUrl', $event)" placeholder="https://linkedin.com/in/usuario" />
      <FormField label="GitHub" type="url" :value="data.personal?.githubUrl" @input="update('personal', 'githubUrl', $event)" placeholder="https://github.com/usuario" />
      <FormField label="Sitio Web" type="url" :value="data.personal?.websiteUrl" @input="update('personal', 'websiteUrl', $event)" placeholder="https://www.tusitio.com" />
      <FormField label="Disponibilidad" type="select" :value="data.personal?.disponibilidad" @input="update('personal', 'disponibilidad', $event)" :options="disponibilidadOptions" />
      <FormField label="Modalidad" :value="data.personal?.modalidad" @input="update('personal', 'modalidad', $event)" placeholder="Presencial / Remoto / Híbrido" />
    </div>
  </div>
</template>

<script setup>
import FormField from '../ui/FormField.vue'

defineProps({ data: { type: Object, required: true } })
const emit = defineEmits(['update'])

const update = (section, field, value) => emit('update', section, field, value)

const disponibilidadOptions = [
  { value: 'Inmediata', label: 'Inmediata' },
  { value: '2 semanas', label: '2 semanas' },
  { value: '1 mes', label: '1 mes' },
  { value: 'A consultar', label: 'A consultar' }
]
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
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
