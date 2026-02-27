<template>
  <header class="cv-header">
    <h1>{{ personal.nombre }}</h1>
    <h2>{{ personal.titulo }}</h2>
    <p>{{ personal.subtitulo }}</p>

    <ul class="cv-header__contact">
      <li>{{ personal.email }}</li>
      <li>{{ personal.telefono }}</li>
      <li>{{ personal.ubicacion }}</li>
      <li>{{ personal.linkedin }}</li>
      <li>{{ personal.github }}</li>
    </ul>
  </header>
</template>

<script setup>
defineProps({
  personal: {
    type: Object,
    required: true
  }
})
</script>

