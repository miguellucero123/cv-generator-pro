<template>
  <section class="cv-block">
    <h3>Competencias Técnicas</h3>

    <div
      v-if="competencias.programacion?.skills?.length"
      class="cv-skills-group"
    >
      <h4>{{ competencias.programacion.titulo }}</h4>
      <ul class="cv-list">
        <li
          v-for="skill in competencias.programacion.skills"
          :key="skill.nombre"
        >
          {{ skill.nombre }} · {{ skill.nivel }}%
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  competencias: {
    type: Object,
    required: true
  }
})
</script>

