import { createRouter, createWebHistory, RouteRecordNameGeneric } from "vue-router"
import Login from '@/views/login/Login.vue'
import Inbox from "@/views/inbox/Inbox.vue"
import Register from "@/views/register/Register.vue"
import { store } from "../lib/vuex/store"
import { MutationTypes } from "../lib/vuex/types/mutation-types"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Inbox,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.getters.isUserAuth) {
          return next({ name: 'home' })
        }

        next()
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: (to, from, next) => {
        if (store.getters.isUserAuth) {
          return next({ name: 'home' })
        }

        next()
      }
    },
  ]
})

router.beforeEach((to, _, next) => {
  const publicRoutes: RouteRecordNameGeneric[] = ['login', 'register', 'forgot-password']

  store.commit(MutationTypes.LOGIN.SET_AUTH)

  if (!publicRoutes.includes(to.name) && (!store.getters.isUserAuth || !store.getters.userId)) {
    return next({ name: 'login' })
  }

  if (publicRoutes.includes(to.name) && store.state.stompClient != null) {
    store.state.stompClient.disconnect()

    store.commit(MutationTypes.SET_STOMP_CLIENT, null)
  }

  next()
})

export default router
