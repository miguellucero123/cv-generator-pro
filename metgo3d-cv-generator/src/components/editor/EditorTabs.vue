<template>
  <div class="editor-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-item', { active: activeTab === tab.id }]"
      @click="$emit('change', tab.id)"
    >
      <i :class="tab.icon"></i>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  tabs: { type: Array, required: true },
  activeTab: { type: String, required: true }
})
defineEmits(['change'])
</script>

<style scoped>
.editor-tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #334155;
  background: #0f172a;
  scrollbar-width: none;
}
.editor-tabs::-webkit-scrollbar { display: none; }
.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #94a3b8;
  font-size: 0.875rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-item:hover { color: #00d4aa; }
.tab-item.active {
  color: #00d4aa;
  border-bottom-color: #00d4aa;
}
</style>
