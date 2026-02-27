<template>
  <section class="cv-block">
    <h3>Experiencia Laboral</h3>
    <p v-if="!experiencia?.length" class="cv-text--muted">
      Agrega tu experiencia laboral desde el editor.
    </p>
    <ul v-else class="cv-list cv-experience-list">
      <li v-for="(exp, idx) in experiencia" :key="idx" class="cv-exp-item">
        <strong>{{ exp.cargo }}</strong>
        <span class="cv-exp-empresa">{{ exp.empresa }}</span>
        <span class="cv-exp-periodo">{{ exp.periodo }}</span>
        <span v-if="exp.ubicacion" class="cv-exp-ubicacion">{{ exp.ubicacion }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  experiencia: {
    type: Array,
    required: false,
    default: () => []
  }
})
</script>

