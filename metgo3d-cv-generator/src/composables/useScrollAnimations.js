/**
 * METGO_3D VIRTUALIZE - Scroll Animations Composable
 */

import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimations(options = {}) {
  const observedElements = ref(new Set())
  let observer = null

  const config = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
    animationClass: 'is-visible',
    ...options
  }

  const initObserver = () => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(config.animationClass)
          observer?.unobserve(entry.target)
        }
      })
    }, { threshold: config.threshold, rootMargin: config.rootMargin })
  }

  const observe = (el) => {
    if (!observer || !el) return
    observer.observe(el)
    observedElements.value.add(el)
  }

  const observeAll = (selector) => {
    document.querySelectorAll(selector).forEach((el) => observe(el))
  }

  const unobserve = (el) => {
    if (!observer || !el) return
    observer.unobserve(el)
    observedElements.value.delete(el)
  }

  const disconnect = () => {
    observer?.disconnect()
    observedElements.value.clear()
  }

  onMounted(initObserver)
  onUnmounted(disconnect)

  return {
    observe,
    observeAll,
    unobserve,
    disconnect,
    observedElements
  }
}
