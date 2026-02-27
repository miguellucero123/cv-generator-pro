<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2>{{ i18n.t ? i18n.t('auth.login') : 'Entrar' }}</h2>
    <div v-if="auth.error.value" class="auth-error">{{ auth.error.value }}</div>
    <div class="form-group">
      <label>Email</label>
      <input v-model="email" type="email" required placeholder="tu@email.com" />
    </div>
    <div class="form-group">
      <label>{{ i18n.t ? i18n.t('auth.password') : 'Contraseña' }}</label>
      <input v-model="password" type="password" required placeholder="••••••••" />
    </div>
    <button type="submit" class="btn-submit" :disabled="auth.loading.value">
      <span v-if="auth.loading.value">...</span>
      <span v-else>{{ i18n.t ? i18n.t('auth.login') : 'Entrar' }}</span>
    </button>
    <p class="auth-link">
      ¿No tienes cuenta?
      <router-link to="/auth/register">{{ i18n.t ? i18n.t('auth.register') : 'Regístrate' }}</router-link>
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthAPI } from '@composables/useAuthAPI'
import { useI18n } from '@composables/useI18n'

const router = useRouter()
const route = useRoute()
const auth = useAuthAPI()
const i18n = useI18n()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push(route.query.redirect || '/dashboard')
  } catch {
    // error shown by auth.error
  }
}
</script>

<style scoped>
.auth-form h2 { margin-bottom: 1.25rem; color: #e5e7eb; font-size: 1.25rem; }
.auth-error { background: #7f1d1d; color: #fecaca; padding: 0.5rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.35rem; color: #94a3b8; font-size: 0.9rem; }
.form-group input { width: 100%; padding: 0.65rem 1rem; background: #1e293b; border: 1px solid #334155; border-radius: 0.5rem; color: #e5e7eb; }
.form-group input:focus { outline: none; border-color: #00d4aa; }
.btn-submit { width: 100%; padding: 0.75rem; background: #00d4aa; color: #0f172a; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }
.btn-submit:hover:not(:disabled) { filter: brightness(1.1); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.auth-link { margin-top: 1.25rem; text-align: center; color: #94a3b8; font-size: 0.9rem; }
.auth-link a { color: #00d4aa; text-decoration: none; }
.auth-link a:hover { text-decoration: underline; }
</style>
