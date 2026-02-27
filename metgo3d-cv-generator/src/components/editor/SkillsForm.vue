<template>
  <div class="form-section">
    <h3 class="form-section-title"><i class="fas fa-cogs"></i> Competencias</h3>

    <div v-if="data.competencias?.programacion" class="skills-block">
      <h4>{{ data.competencias.programacion.titulo }}</h4>
      <p class="form-hint">Edición de competencias técnicas en versión futura.</p>
      <ul class="skills-list">
        <li v-for="(s, i) in data.competencias.programacion.skills" :key="i">
          {{ s.nombre }} · {{ s.nivel }}%
        </li>
      </ul>
    </div>

    <div v-if="data.competencias?.datascience" class="skills-block">
      <h4>{{ data.competencias.datascience.titulo }}</h4>
      <ul class="skills-list">
        <li v-for="(s, i) in data.competencias.datascience.skills" :key="i">
          {{ s.nombre }} · {{ s.nivel }}%
        </li>
      </ul>
    </div>

    <div v-if="data.competencias?.herramientas" class="skills-block">
      <h4>{{ data.competencias.herramientas.titulo }}</h4>
      <ul class="skills-list">
        <li v-for="(s, i) in data.competencias.herramientas.skills" :key="i">
          {{ s.nombre }} · {{ s.nivel }}%
        </li>
      </ul>
    </div>

    <div v-if="data.competencias?.soft" class="skills-block">
      <h4>{{ data.competencias.soft.titulo }}</h4>
      <ul class="skills-list">
        <li v-for="(s, i) in data.competencias.soft.skills" :key="i">{{ s }}</li>
      </ul>
    </div>
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
.skills-block { margin-bottom: 1rem; }
.skills-block h4 {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}
.skills-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.skills-list li {
  padding: 0.25rem 0.5rem;
  background: #1e293b;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  color: #d1d5db;
}
.form-hint { font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }
</style>
