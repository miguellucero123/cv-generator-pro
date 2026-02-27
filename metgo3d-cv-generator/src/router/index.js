/**
 * METGO_3D VIRTUALIZE - Vue Router
 */

import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@composables/useAPI'
import MainLayout from '@layouts/MainLayout.vue'
import AuthLayout from '@layouts/AuthLayout.vue'
import HomeView from '@views/HomeView.vue'
import LoginView from '@views/LoginView.vue'
import RegisterView from '@views/RegisterView.vue'
import DashboardView from '@views/DashboardView.vue'
import PublicCvView from '@views/PublicCvView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'edit/:id', name: 'edit', component: HomeView, meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView }
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'dashboard-list', component: DashboardView }]
  },
  {
    path: '/cv/:publicUrl',
    name: 'public-cv',
    component: PublicCvView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = getToken()
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
