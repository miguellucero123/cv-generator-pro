<template>
  <section class="cv-block">
    <h3>{{ t ? t('cv.education') : 'Formación Académica' }}</h3>
    <p v-if="!educacion.length" class="cv-text--muted">
      {{ t ? t('cv.emptyEducation') : 'Información de educación se mostrará aquí.' }}
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
  },
  t: {
    type: Function,
    default: null
  }
})
</script>

