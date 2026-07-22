import { createRouter, createWebHistory } from 'vue-router'

import RootPage from '../pages/RootPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'

export const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: RootPage,
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/register',
      component: RegisterPage,
    },
  ],
})
