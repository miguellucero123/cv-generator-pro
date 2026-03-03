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
.language-selector { display: flex; gap: 0.5rem; }
.lang-btn {
  padding: 0.4rem 0.6rem;
  background: #1e293b;
  border: 2px solid #475569;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-btn:hover { 
  border-color: #00d4aa; 
  color: #00d4aa;
  background: rgba(0, 212, 170, 0.1);
}
.lang-btn.active { 
  border-color: #00d4aa; 
  background: #00d4aa;
  color: #0f172a;
}
</style>
