import { createRouter, createWebHistory } from "vue-router"
import Login from '../views/login/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'home',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Login
    },
  ]
})


export default router
