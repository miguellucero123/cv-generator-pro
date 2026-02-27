<template>
  <teleport to="body">
    <transition name="presentation-fade">
      <div v-if="isActive" class="presentation-container">
        <div class="presentation-bg"></div>
        <header class="presentation-header">
          <div class="header-brand">
            <i class="fas fa-cube"></i>
            <span>{{ brand.fullName }}</span>
          </div>
          <div class="header-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
          </div>
          <div class="header-actions">
            <button class="btn-pres" @click="toggleAutoPlay" :title="isPaused ? 'Reproducir' : 'Pausar'">
              <i :class="isPaused ? 'fas fa-play' : 'fas fa-pause'"></i>
            </button>
            <button class="btn-pres" @click="endPresentation" title="Salir (Esc)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </header>
        <div class="slides-container">
          <transition name="slide-fade" mode="out-in">
            <SlideView :key="currentSlide" :slide="currentSlideData" :data="cvData" />
          </transition>
        </div>
        <SlideControls :has-prev="hasPrev" :has-next="hasNext" @prev="prevSlide" @next="nextSlide" />
        <div class="slide-indicators">
          <button
            v-for="(s, i) in slides"
            :key="i"
            :class="['indicator', { active: currentSlide === i }]"
            @click="goToSlide(i)"
          />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import SlideView from './SlideView.vue'
import SlideControls from './SlideControls.vue'

defineProps({
  isActive: Boolean,
  currentSlide: Number,
  totalSlides: Number,
  progress: Number,
  isPaused: Boolean,
  hasNext: Boolean,
  hasPrev: Boolean,
  currentSlideData: Object,
  cvData: Object,
  brand: Object,
  slides: Array
})

const emit = defineEmits(['next', 'prev', 'go-to', 'toggle-autoplay', 'end'])

const toggleAutoPlay = () => emit('toggle-autoplay')
const endPresentation = () => emit('end')
const nextSlide = () => emit('next')
const prevSlide = () => emit('prev')
const goToSlide = (i) => emit('go-to', i)
</script>

<style scoped>
.presentation-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: #0a0a14;
  overflow: hidden;
}
.presentation-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 20% 20%, rgba(0, 212, 170, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(0, 168, 150, 0.08) 0%, transparent 50%);
}
.presentation-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(0, 212, 170, 0.2);
}
.header-brand { display: flex; align-items: center; gap: 0.5rem; color: #00d4aa; font-weight: 600; }
.header-progress { display: flex; align-items: center; gap: 1rem; }
.progress-bar { width: 120px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: #00d4aa; transition: width 0.4s; }
.progress-text { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
.header-actions { display: flex; gap: 0.5rem; }
.btn-pres {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
}
.btn-pres:hover { background: #00d4aa; border-color: #00d4aa; }
.slides-container {
  flex: 1;
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.slide-indicators {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 20;
}
.indicator {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: none;
  cursor: pointer;
}
.indicator.active { background: #00d4aa; }
.presentation-fade-enter-active,
.presentation-fade-leave-active { transition: opacity 0.3s; }
.presentation-fade-enter-from,
.presentation-fade-leave-to { opacity: 0; }
.slide-fade-enter-active,
.slide-fade-leave-active { transition: opacity 0.4s, transform 0.4s; }
.slide-fade-enter-from { opacity: 0; transform: translateX(30px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
