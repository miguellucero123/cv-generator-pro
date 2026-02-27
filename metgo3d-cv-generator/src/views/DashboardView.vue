<template>
  <div class="dashboard">
    <section class="dashboard-header">
      <h1>Mis CVs</h1>
      <router-link to="/" class="btn-new">+ Nuevo CV</router-link>
    </section>

    <div v-if="cvApi.loading.value && !cvApi.cvs.value?.length" class="loading">Cargando...</div>
    <div v-else-if="cvApi.error.value" class="error">{{ cvApi.error.value }}</div>
    <div v-else-if="!cvApi.cvs.value?.length" class="empty">
      <p>No tienes CVs guardados.</p>
      <router-link to="/" class="btn-primary">Crear mi primer CV</router-link>
    </div>
    <div v-else class="cv-grid">
      <CvCard
        v-for="cv in cvApi.cvs.value"
        :key="cv._id"
        :cv="cv"
        @edit="goEdit"
        @clone="handleClone"
        @delete="handleDelete"
        @share="handleShare"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCVAPI } from '@composables/useCVAPI'
import CvCard from '@components/dashboard/CvCard.vue'

const router = useRouter()
const cvApi = useCVAPI()

const goEdit = (id) => router.push({ name: 'edit', params: { id } })
const handleClone = async (id) => {
  try {
    await cvApi.cloneCV(id)
  } catch (e) {
    console.error(e)
  }
}
const handleDelete = async (id) => {
  if (!confirm('¿Eliminar este CV?')) return
  try {
    await cvApi.deleteCV(id)
  } catch (e) {
    console.error(e)
  }
}
const handleShare = (cv) => {
  const url = `${window.location.origin}/cv/${cv.sharing?.publicUrl || '...'}`
  if (cv.sharing?.isPublic) {
    navigator.clipboard?.writeText(url)
    alert('URL copiada al portapapeles')
  } else {
    alert('Activa la opción "Público" en Compartir para obtener el enlace.')
  }
}

onMounted(() => cvApi.getCVs())
</script>

<style scoped>
.dashboard { padding: 1rem 0; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.dashboard-header h1 { color: #e5e7eb; font-size: 1.5rem; }
.btn-new { padding: 0.6rem 1.2rem; background: #00d4aa; color: #0f172a; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
.btn-new:hover { filter: brightness(1.1); }
.loading, .error, .empty { text-align: center; padding: 3rem; color: #94a3b8; }
.error { color: #f87171; }
.empty p { margin-bottom: 1rem; }
.btn-primary { display: inline-block; padding: 0.6rem 1.2rem; background: #00d4aa; color: #0f172a; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
.cv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
</style>
