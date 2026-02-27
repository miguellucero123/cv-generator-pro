<template>
  <div class="slide-controls">
    <button class="btn-nav prev" :disabled="!hasPrev" @click="$emit('prev')">
      <i class="fas fa-chevron-left"></i>
    </button>
    <button class="btn-nav next" :disabled="!hasNext" @click="$emit('next')">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false }
})
defineEmits(['prev', 'next'])
</script>

<style scoped>
.slide-controls {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 20;
  pointer-events: none;
}
.btn-nav {
  pointer-events: auto;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 170, 0.2);
  border: 1px solid rgba(0, 212, 170, 0.5);
  border-radius: 50%;
  color: #00d4aa;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-nav:hover:not(:disabled) {
  background: rgba(0, 212, 170, 0.4);
  transform: scale(1.1);
}
.btn-nav:disabled { opacity: 0.3; cursor: not-allowed; }
</style>
