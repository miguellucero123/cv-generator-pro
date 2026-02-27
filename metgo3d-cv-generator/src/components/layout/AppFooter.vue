<template>
  <footer class="app-footer">
    <small>
      © {{ year }} METGO_3D VIRTUALIZE ·
      <a :href="website" target="_blank" rel="noreferrer">
        {{ website }}
      </a>
    </small>
  </footer>
</template>

<script setup>
defineProps({
  website: {
    type: String,
    required: true
  }
})

const year = new Date().getFullYear()
</script>

