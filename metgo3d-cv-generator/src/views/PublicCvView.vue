<template>
  <div class="public-cv">
    <div v-if="shareApi.loading.value && !shareApi.publicCV.value" class="loading">Cargando CV...</div>
    <div v-else-if="shareApi.error.value && !needsPassword" class="error">
      <p>{{ shareApi.error.value }}</p>
      <router-link to="/">Volver al inicio</router-link>
    </div>
    <div v-else-if="needsPassword" class="password-modal">
      <div class="password-card">
        <h2>CV protegido</h2>
        <p>Introduce la contraseña para ver este CV.</p>
        <form @submit.prevent="submitPassword">
          <input v-model="password" type="password" placeholder="Contraseña" required />
          <button type="submit" :disabled="shareApi.loading.value">Acceder</button>
        </form>
      </div>
    </div>
    <div v-else-if="cvData" class="public-cv__content">
      <header class="public-cv__header">
        <router-link to="/" class="back-link">← Volver</router-link>
      </header>
      <section class="cv-section cv-preview template-modern">
        <CVPreview :cv-data="cvData" template="modern" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShareAPI } from '@composables/useShareAPI'
import CVPreview from '@components/cv/CVPreview.vue'

const route = useRoute()
const shareApi = useShareAPI()
const password = ref('')
const authToken = ref(null)

const needsPassword = computed(() => {
  const err = shareApi.error.value || ''
  return err.includes('contraseña') || err.includes('PASSWORD') || err.includes('requiere')
})

const cvData = computed(() => shareApi.publicCV.value ? mapToFrontend(shareApi.publicCV.value) : null)

function mapToFrontend(apiCv) {
  const pi = apiCv.personalInfo || {}
  const c = pi.contact || {}
  return {
    personal: {
      nombre: [pi.firstName, pi.lastName].filter(Boolean).join(' ').trim() || 'Nombre',
      titulo: pi.title,
      ubicacion: c.location,
      telefono: c.phone,
      email: c.email,
      linkedin: c.linkedin,
      linkedinUrl: c.linkedin,
      github: c.github,
      githubUrl: c.github,
      website: c.website,
      websiteUrl: c.website,
      portfolio: c.portfolio,
      portfolioUrl: c.portfolio
    },
    perfil: { resumen: pi.summary, destacados: [], propuestaValor: '' },
    competencias: { programacion: { skills: [] }, datascience: { skills: [] }, herramientas: { skills: [] }, soft: { skills: [] } },
    educacion: (apiCv.education || []).map(e => ({ titulo: e.degree, institucion: e.institution, periodo: e.endDate || e.startDate })),
    experiencia: (apiCv.experience || []).map(e => ({ cargo: e.position, empresa: e.company, periodo: [e.startDate, e.endDate].filter(Boolean).join(' - '), logros: (e.achievements || []).map(a => ({ descripcion: typeof a === 'string' ? a : a.descripcion })) })),
    proyectos: apiCv.projects || [],
    certificaciones: []
  }
}

const loadCv = () => {
  shareApi.clearCV()
  shareApi.getPublicCV(route.params.publicUrl, authToken.value).catch(() => {})
}

const submitPassword = async () => {
  try {
    const token = await shareApi.verifyPassword(route.params.publicUrl, password.value)
    if (token) {
      authToken.value = token
      loadCv()
    }
  } catch (e) {
    console.error(e)
  }
}

watch(() => route.params.publicUrl, loadCv, { immediate: true })
onMounted(loadCv)
</script>

<style scoped>
.public-cv { min-height: 100vh; background: radial-gradient(circle at top, #0b1120 0, #020617 100%); padding: 2rem; }
.loading, .error { text-align: center; padding: 4rem; color: #94a3b8; }
.error { color: #f87171; }
.error a { color: #00d4aa; }
.password-modal { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
.password-card { background: #0f172a; padding: 2rem; border-radius: 1rem; max-width: 360px; width: 100%; border: 1px solid rgba(148,163,184,0.2); }
.password-card h2 { margin-bottom: 0.5rem; color: #e5e7eb; }
.password-card p { color: #94a3b8; margin-bottom: 1rem; }
.password-card input { width: 100%; padding: 0.65rem; margin-bottom: 1rem; background: #1e293b; border: 1px solid #334155; border-radius: 0.5rem; color: #e5e7eb; }
.password-card button { width: 100%; padding: 0.65rem; background: #00d4aa; color: #0f172a; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
.public-cv__header { margin-bottom: 1rem; }
.back-link { color: #94a3b8; text-decoration: none; }
.back-link:hover { color: #00d4aa; }
</style>
