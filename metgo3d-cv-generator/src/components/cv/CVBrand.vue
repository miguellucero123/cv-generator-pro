<template>
  <section class="cv-brand">
    <div class="cv-brand__left">
      <div class="cv-brand__logo">
        <span>{{ brand.name }}</span>
        <small>{{ brand.tagline }}</small>
      </div>
      <a :href="brand.website" target="_blank" rel="noreferrer">
        {{ brand.website }}
      </a>
    </div>
    <CVQRCode :url="brand.website" :size="56" />
  </section>
</template>

<script setup>
import { brandConfig as brand } from '@data/cvData'
import CVQRCode from './CVQRCode.vue'
</script>

