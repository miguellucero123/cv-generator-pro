<template>
  <div class="cv-card">
    <div class="cv-card__header">
      <h3>{{ cv.title || 'Sin título' }}</h3>
      <span class="badge" :class="cv.status">{{ cv.status || 'draft' }}</span>
    </div>
    <p class="cv-card__meta">{{ cv.design?.template || 'modern' }} · {{ formatDate(cv.updatedAt) }}</p>
    <p v-if="cv.analytics?.views" class="cv-card__stats">{{ cv.analytics.views }} vistas</p>
    <div class="cv-card__actions">
      <button class="btn-sm" @click="$emit('edit', cv._id)" title="Editar"><i class="fas fa-edit"></i></button>
      <button class="btn-sm" @click="$emit('clone', cv._id)" title="Clonar"><i class="fas fa-copy"></i></button>
      <button class="btn-sm" @click="$emit('share', cv)" title="Compartir"><i class="fas fa-share-alt"></i></button>
      <button class="btn-sm danger" @click="$emit('delete', cv._id)" title="Eliminar"><i class="fas fa-trash"></i></button>
    </div>
  </div>
</template>

<script setup>
defineProps({ cv: { type: Object, required: true } })
defineEmits(['edit', 'clone', 'delete', 'share'])

const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.cv-card {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: border-color 0.2s;
}
.cv-card:hover { border-color: #00d4aa; }
.cv-card__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; }
.cv-card__header h3 { color: #e5e7eb; font-size: 1rem; margin: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 0.35rem; text-transform: uppercase; }
.badge.draft { background: #334155; color: #94a3b8; }
.badge.published { background: #065f46; color: #6ee7b7; }
.cv-card__meta, .cv-card__stats { font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; }
.cv-card__actions { display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; }
.btn-sm { padding: 0.4rem 0.6rem; background: #1e293b; color: #94a3b8; border: none; border-radius: 0.35rem; cursor: pointer; }
.btn-sm:hover { color: #00d4aa; }
.btn-sm.danger:hover { color: #f87171; }
</style>
