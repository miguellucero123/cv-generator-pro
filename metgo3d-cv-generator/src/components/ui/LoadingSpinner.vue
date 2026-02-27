<template>
  <span class="loading-spinner" :class="`spinner-${size}`">
    <i class="fas fa-spinner fa-spin"></i>
  </span>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #00d4aa;
}
.spinner-sm { font-size: 0.875rem; }
.spinner-md { font-size: 1rem; }
.spinner-lg { font-size: 1.25rem; }
</style>
