<template>
  <div class="language-selector">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      :class="['lang-btn', { active: locale === loc.code }]"
      @click="$emit('change', loc.code)"
      :title="loc.name"
    >
      {{ loc.flag }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  locale: { type: String, default: 'es' },
  availableLocales: { type: Array, default: () => [] }
})
defineEmits(['change'])
</script>

<style scoped>
.language-selector { display: flex; gap: 0.25rem; }
.lang-btn {
  padding: 0.35rem 0.5rem;
  background: transparent;
  border: 1px solid #334155;
  border-radius: 0.35rem;
  font-size: 1rem;
  cursor: pointer;
}
.lang-btn:hover { border-color: #00d4aa; }
.lang-btn.active { border-color: #00d4aa; background: rgba(0, 212, 170, 0.1); }
</style>
