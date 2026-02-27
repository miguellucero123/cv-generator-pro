/**
 * METGO_3D VIRTUALIZE - Presentation Mode Composable
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

export function usePresentation(slidesSource = []) {
  const isActive = ref(false)
  const currentSlide = ref(0)
  const isTransitioning = ref(false)
  const isPaused = ref(false)
  let autoPlayInterval = null

  const slides = computed(() => {
    const s = slidesSource?.value ?? slidesSource
    return Array.isArray(s) ? s : []
  })

  const totalSlides = computed(() => slides.value.length)
  const hasNext = computed(() => currentSlide.value < totalSlides.value - 1)
  const hasPrev = computed(() => currentSlide.value > 0)
  const progress = computed(() => (totalSlides.value ? ((currentSlide.value + 1) / totalSlides.value) * 100 : 0))
  const currentSlideData = computed(() => slides.value[currentSlide.value] || null)

  const startPresentation = () => {
    isActive.value = true
    currentSlide.value = 0
    document.body.style.overflow = 'hidden'
  }

  const endPresentation = () => {
    isActive.value = false
    stopAutoPlay()
    document.body.style.overflow = ''
  }

  const nextSlide = () => {
    if (!hasNext.value || isTransitioning.value) return
    isTransitioning.value = true
    currentSlide.value++
    setTimeout(() => { isTransitioning.value = false }, 400)
  }

  const prevSlide = () => {
    if (!hasPrev.value || isTransitioning.value) return
    isTransitioning.value = true
    currentSlide.value--
    setTimeout(() => { isTransitioning.value = false }, 400)
  }

  const goToSlide = (index) => {
    if (index < 0 || index >= totalSlides.value || isTransitioning.value) return
    isTransitioning.value = true
    currentSlide.value = index
    setTimeout(() => { isTransitioning.value = false }, 400)
  }

  const startAutoPlay = () => {
    isPaused.value = false
    autoPlayInterval = setInterval(() => {
      if (hasNext.value) nextSlide()
      else currentSlide.value = 0
    }, 5000)
  }

  const stopAutoPlay = () => {
    isPaused.value = true
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }

  const toggleAutoPlay = () => {
    if (isPaused.value) startAutoPlay()
    else stopAutoPlay()
  }

  const handleKeydown = (e) => {
    if (!isActive.value) return
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); return }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); return }
    if (e.key === 'Escape') endPresentation()
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    stopAutoPlay()
  })

  return {
    isActive,
    currentSlide,
    isTransitioning,
    isPaused,
    totalSlides,
    hasNext,
    hasPrev,
    progress,
    currentSlideData,
    startPresentation,
    endPresentation,
    nextSlide,
    prevSlide,
    goToSlide,
    startAutoPlay,
    stopAutoPlay,
    toggleAutoPlay
  }
}
