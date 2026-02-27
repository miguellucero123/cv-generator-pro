<template>
  <div class="cv-qrcode" v-if="url">
    <QRCode :value="url" :size="size" color="#0f172a" bg-color="#ffffff" />
    <span class="cv-qrcode__label">Escanea para ver online</span>
  </div>
</template>

<script setup>
import QRCode from '../ui/QRCode.vue'

defineProps({
  url: { type: String, default: '' },
  size: { type: Number, default: 60 }
})
</script>

<style scoped>
.cv-qrcode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.5rem;
}
.cv-qrcode__label {
  font-size: 0.7rem;
  color: #64748b;
}
</style>
