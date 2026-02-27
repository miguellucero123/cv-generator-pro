<template>
  <section class="cv-block">
    <h3>Perfil Profesional</h3>
    <p class="cv-text">
      {{ perfil.resumen }}
    </p>

    <ul class="cv-list">
      <li v-for="item in perfil.destacados" :key="item">
        {{ item }}
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  perfil: {
    type: Object,
    required: true
  }
})
</script>

