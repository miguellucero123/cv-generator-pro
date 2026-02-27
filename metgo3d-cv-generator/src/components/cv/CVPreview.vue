<template>
  <section class="cv-section cv-preview" :class="`template-${template || 'modern'}`">
    <div class="scroll-animate">
      <CVHeader :personal="cvData.personal" />
    </div>

    <div class="cv-columns">
      <div class="cv-column">
        <div class="scroll-animate"><CVProfile :perfil="cvData.perfil" /></div>
        <div class="scroll-animate"><CVSkills :competencias="cvData.competencias" /></div>
      </div>

      <div class="cv-column">
        <div class="scroll-animate"><CVEducation :educacion="cvData.educacion" /></div>
        <div class="scroll-animate"><CVExperience :experiencia="cvData.experiencia" /></div>
        <div class="scroll-animate"><CVProjects :proyectos="cvData.proyectos" /></div>
      </div>
    </div>

    <div class="scroll-animate"><CVBrand /></div>
  </section>
</template>

<script setup>
import CVHeader from './CVHeader.vue'
import CVProfile from './CVProfile.vue'
import CVSkills from './CVSkills.vue'
import CVEducation from './CVEducation.vue'
import CVExperience from './CVExperience.vue'
import CVProjects from './CVProjects.vue'
import CVBrand from './CVBrand.vue'

defineProps({
  cvData: { type: Object, required: true },
  template: { type: String, default: 'modern' }
})
</script>

