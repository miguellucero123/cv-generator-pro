<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-info-circle"></i> Adicional</h3>
    <div class="array-list" v-if="data.certificaciones?.length">
      <div
        v-for="(cert, idx) in data.certificaciones"
        :key="idx"
        class="array-item compact"
      >
        <strong>{{ cert.nombre }}</strong> — {{ cert.institucion }} ({{ cert.fecha }})
      </div>
    </div>
    <p v-else class="form-hint">Certificaciones y datos adicionales se gestionan desde la importación de datos.</p>
  </div>
</template>

<script setup>
defineProps({ data: { type: Object, required: true } })
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
.array-list { display: flex; flex-direction: column; gap: 0.5rem; }
.array-item.compact {
  padding: 0.5rem;
  background: #1e293b;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #d1d5db;
}
.form-hint { font-size: 0.8rem; color: #64748b; }
</style>
