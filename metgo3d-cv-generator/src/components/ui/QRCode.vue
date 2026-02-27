<template>
  <div class="qr-code-wrapper" :class="{ 'is-loading': isLoading }">
    <canvas ref="canvasRef" :width="size" :height="size" class="qr-canvas"></canvas>
    <div v-if="isLoading" class="qr-loading">
      <LoadingSpinner size="sm" />
    </div>
    <div v-if="qrError" class="qr-error">
      <i class="fas fa-exclamation-triangle"></i>
      <span>Error</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  value: { type: String, required: true },
  size: { type: Number, default: 100 },
  color: { type: String, default: '#000000' },
  bgColor: { type: String, default: '#ffffff' }
})

const canvasRef = ref(null)
const isLoading = ref(true)
const qrError = ref(null)

const generateQR = async () => {
  if (!canvasRef.value || !props.value) return
  isLoading.value = true
  qrError.value = null
  try {
    const QRCode = (await import('qrcode')).default
    await QRCode.toCanvas(canvasRef.value, props.value, {
      width: props.size,
      margin: 2,
      color: { dark: props.color, light: props.bgColor },
      errorCorrectionLevel: 'M'
    })
  } catch (err) {
    qrError.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(generateQR)
watch(() => [props.value, props.size], generateQR)
</script>

<style scoped>
.qr-code-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 6px;
  border-radius: 0.375rem;
}
.qr-canvas { display: block; }
.qr-loading, .qr-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  border-radius: 0.375rem;
}
.qr-error { color: #ef4444; font-size: 0.75rem; }
</style>
