import { createRouter, createWebHistory, RouteRecordNameGeneric } from "vue-router"
import { store } from "../lib/vuex/store"
import { MutationTypes } from "../lib/vuex/types/mutation-types"
import Login from '@/views/login/Login.vue'
import Email from "@/views/email/Email.vue"
import Register from "@/views/register/Register.vue"
import HomeArea from "@/views/homeArea/HomeArea.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeArea,
    },
    {
      path: '/mail/:emailId',
      name: 'email',
      component: Email,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
  ]
})

router.beforeEach((to, _, next) => {
  const publicRoutes: RouteRecordNameGeneric[] = ['login', 'register', 'forgot-password']

  store.commit(MutationTypes.LOGIN.SET_AUTH)

  if (publicRoutes.includes(to.name) && store.getters.isUserAuth) {
    return next({ name: 'home' })
  }

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
