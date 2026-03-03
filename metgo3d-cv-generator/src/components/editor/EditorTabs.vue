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
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent;
  padding-bottom: 2px;
}
.editor-tabs::-webkit-scrollbar { height: 4px; }
.editor-tabs::-webkit-scrollbar-track { background: transparent; }
.editor-tabs::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
.tab-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.7rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #94a3b8;
  font-size: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.tab-item i {
  font-size: 0.75rem;
}
.tab-item:hover { color: #00d4aa; }
.tab-item.active {
  color: #00d4aa;
  border-bottom-color: #00d4aa;
  background: rgba(0,212,170,0.1);
}
@media (max-width: 500px) {
  .tab-label { display: none; }
  .tab-item { padding: 0.6rem 0.8rem; }
  .tab-item i { font-size: 1rem; }
}
</style>
