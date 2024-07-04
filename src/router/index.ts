import { createRouter, createWebHistory } from "vue-router"
import Login from '@/views/login/Login.vue'
import Home from "@/views/home/Home.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        // const isAuth = true

        // if(!isAuth) {
        //   return next({ name: 'login' })
        // }

        next()
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        // const isAuth = false

        // if (isAuth) {
        //   return next({ name: 'home' })
        // }

        next()
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Login
    },
  ]
})


export default router
