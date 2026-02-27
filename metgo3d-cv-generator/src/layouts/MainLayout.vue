<template>
  <div class="main-layout">
    <AppHeader
      :brand="brandConfig"
      :nombre="headerNombre"
      :t="i18n.t"
      :locale="i18n.locale.value"
      :available-locales="i18n.availableLocales"
      :show-auth="true"
      :is-logged-in="auth.isLoggedIn.value"
      :user-name="userName"
      @change-locale="i18n.setLocale"
      @logout="auth.logout"
    />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
    <AppFooter v-if="showFooter" :website="brandConfig.website" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@composables/useI18n'
import { useAuthAPI } from '@composables/useAuthAPI'
import { brandConfig } from '@data/cvData'
import AppHeader from '@components/layout/AppHeader.vue'
import AppFooter from '@components/layout/AppFooter.vue'

const route = useRoute()
const i18n = useI18n()
const auth = useAuthAPI()

const showFooter = computed(() => route.name !== 'public-cv')

const headerNombre = computed(() => {
  if (route.name === 'dashboard' || route.name === 'dashboard-list') return 'Mis CVs'
  return 'METGO_3D'
})

const userName = computed(() => auth.user?.value?.name)

onMounted(() => {
  auth.initFromToken()
})
</script>
