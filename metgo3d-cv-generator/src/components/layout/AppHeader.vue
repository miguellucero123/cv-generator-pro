<template>
  <header class="app-header">
    <router-link to="/" class="header-main">
      <span class="brand-tagline">{{ brand.fullName }}</span>
      <h1>{{ nombre }}</h1>
      <p>{{ t ? t('app.tagline') : 'CV Profesional' }}</p>
    </router-link>
    <div class="header-actions">
      <LanguageSelector
        v-if="availableLocales?.length"
        :locale="locale"
        :available-locales="availableLocales"
        @change="$emit('change-locale', $event)"
      />
      <template v-if="showAuth">
        <router-link v-if="!isLoggedIn" to="/auth/login" class="btn-auth">{{ t ? t('auth.login') : 'Entrar' }}</router-link>
        <router-link v-else to="/dashboard" class="btn-auth">{{ userName || 'Mi cuenta' }}</router-link>
        <button v-if="isLoggedIn" class="btn-auth btn-logout" @click="$emit('logout')">
          {{ t ? t('auth.logout') : 'Salir' }}
        </button>
      </template>
    </div>
  </header>
</template>

<script setup>
import LanguageSelector from '../ui/LanguageSelector.vue'

defineProps({
  brand: { type: Object, required: true },
  nombre: { type: String, required: true },
  t: { type: Function, default: null },
  locale: { type: String, default: 'es' },
  availableLocales: { type: Array, default: () => [] },
  showAuth: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  userName: { type: String, default: '' }
})
defineEmits(['change-locale', 'logout'])
</script>

<style scoped>
.app-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.header-main { flex: 1; text-decoration: none; color: inherit; }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.btn-auth { padding: 0.4rem 0.8rem; border-radius: 0.5rem; background: #1e293b; color: #e5e7eb; text-decoration: none; font-size: 0.9rem; border: 1px solid #334155; }
.btn-auth:hover { background: #334155; color: #00d4aa; }
.btn-logout { cursor: pointer; border-color: #7f1d1d; }
.btn-logout:hover { background: #7f1d1d; }
</style>

