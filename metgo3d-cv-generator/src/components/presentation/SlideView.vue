<template>
  <div class="slide-view" :class="`slide-${slide?.type}`">
    <template v-if="slide?.type === 'title'">
      <h1 class="slide-title">{{ slide.title }}</h1>
      <h2 class="slide-subtitle">{{ slide.subtitle }}</h2>
      <p v-if="slide.content" class="slide-content">{{ slide.content }}</p>
    </template>
    <template v-else-if="slide?.type === 'profile'">
      <h2 class="slide-heading">{{ slide.title }}</h2>
      <p class="slide-body">{{ slide.content }}</p>
    </template>
    <template v-else-if="slide?.type === 'skills'">
      <h2 class="slide-heading">{{ slide.title }}</h2>
      <div class="slide-tags">
        <span v-for="(item, i) in slide.items" :key="i" class="slide-tag">{{ item }}</span>
      </div>
    </template>
    <template v-else-if="slide?.type === 'list'">
      <h2 class="slide-heading">{{ slide.title }}</h2>
      <ul class="slide-list">
        <li v-for="(item, i) in slide.items" :key="i">{{ item }}</li>
      </ul>
    </template>
    <template v-else-if="slide?.type === 'contact'">
      <h2 class="slide-heading">{{ slide.title }}</h2>
      <div class="slide-contact">
        <p v-if="slide.email"><i class="fas fa-envelope"></i> {{ slide.email }}</p>
        <p v-if="slide.phone"><i class="fas fa-phone"></i> {{ slide.phone }}</p>
        <p v-if="slide.location"><i class="fas fa-map-marker-alt"></i> {{ slide.location }}</p>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  slide: { type: Object, default: null },
  data: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.slide-view {
  max-width: 800px;
  padding: 2rem;
  text-align: center;
}
.slide-title { font-size: 2rem; margin-bottom: 0.5rem; color: #fff; }
.slide-subtitle { font-size: 1.25rem; color: #00d4aa; margin-bottom: 1rem; }
.slide-content { color: #94a3b8; }
.slide-heading { font-size: 1.5rem; color: #00d4aa; margin-bottom: 1.5rem; }
.slide-body { color: #d1d5db; line-height: 1.7; text-align: left; }
.slide-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.slide-tag {
  padding: 0.35rem 0.75rem;
  background: rgba(0, 212, 170, 0.2);
  border-radius: 0.5rem;
  color: #00d4aa;
  font-size: 0.9rem;
}
.slide-list { text-align: left; list-style: none; color: #d1d5db; }
.slide-list li { padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.slide-contact p { margin: 0.5rem 0; color: #d1d5db; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.slide-contact i { color: #00d4aa; width: 1.25rem; }
</style>
