<template>
  <section class="cv-block">
    <h3>Formación Académica</h3>
    <p v-if="!educacion.length" class="cv-text--muted">
      Información de educación se mostrará aquí.
    </p>
    <ul v-else class="cv-list">
      <li v-for="edu in educacion" :key="edu.titulo">
        <strong>{{ edu.titulo }}</strong><br />
        {{ edu.institucion }} · {{ edu.periodo }}
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  educacion: {
    type: Array,
    default: () => []
  }
})
</script>

