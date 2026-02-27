<template>
  <section class="cv-block">
    <h3>Proyectos</h3>
    <p v-if="!proyectos?.length" class="cv-text--muted">
      Agrega tus proyectos desde el editor.
    </p>
    <ul v-else class="cv-list">
      <li v-for="(proj, idx) in proyectos" :key="idx" class="cv-proj-item">
        <strong>{{ proj.nombre }}</strong>
        <span v-if="proj.descripcion">{{ proj.descripcion }}</span>
        <a v-if="proj.url" :href="proj.url" target="_blank" rel="noreferrer">{{ proj.url }}</a>
        <a v-if="proj.github" :href="proj.github" target="_blank" rel="noreferrer">GitHub</a>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  proyectos: {
    type: Array,
    required: false,
    default: () => []
  }
})
</script>

