import { createRouter, createWebHistory, RouteRecordNameGeneric } from "vue-router"
import { store } from "../lib/vuex/store"
import { MutationTypes } from "../lib/vuex/types/mutation-types"
import Login from '@/views/login/Login.vue'
import Email from "@/views/email/Email.vue"
import Register from "@/views/register/Register.vue"
import Inbox from "../views/inbox/Inbox.vue"
import NoEmailSelected from "../views/noEmailSelected/NoEmailSelected.vue"
import Spam from "../views/spam/Spam.vue"
import Sent from "../views/sent/Sent.vue"
import Trash from "../views/trash/Trash.vue"
import Contacts from "../views/contacts/Contacts.vue"
import Draft from "../views/draft/Draft.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
      meta: {
        fallBackName: 'noEmailSelected',
      },
      children: [
        {
          path: '',
          name: 'noEmailSelected',
          component: NoEmailSelected,
        },
        {
          path: ':emailId',
          name: 'email',
          component: Email,
        },
      ]
    },
    {
      path: '/sent',
      name: 'sent',
      component: Sent,
      meta: {
        fallBackName: 'noEmailSelectedSent',
      },
      children: [
        {
          path: '',
          name: 'noEmailSelectedSent',
          component: NoEmailSelected,
        },
        {
          path: ':emailId',
          name: 'emailSent',
          component: Email,
        },
      ]
    },
    {
      path: '/spam',
      name: 'spam',
      component: Spam,
      meta: {
        fallBackName: 'noEmailSelectedSpam',
      },
      children: [
        {
          path: '',
          name: 'noEmailSelectedSpam',
          component: NoEmailSelected,
        },
        {
          path: ':emailId',
          name: 'emailSpam',
          component: Email,
        },
      ]
    },
    {
      path: '/draft',
      name: 'draft',
      component: Draft,
      meta: {
        fallBackName: 'noEmailSelectedDraft',
      },
      children: [
        {
          path: '',
          name: 'noEmailSelectedDraft',
          component: NoEmailSelected,
        },
        {
          path: ':emailId',
          name: 'emailDraft',
          component: Email,
        },
      ]
    },
    {
      path: '/trash',
      name: 'trash',
      component: Trash,
      meta: {
        fallBackName: 'noEmailSelectedTrash',
      },
      children: [
        {
          path: '',
          name: 'noEmailSelectedTrash',
          component: NoEmailSelected,
        },
        {
          path: ':emailId',
          name: 'emailTrash',
          component: Email,
        },
      ]
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
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
      meta: {
        fallBackName: 'contacts',
      },
    },
    {
      path: '/:catchAll(.*)',
      redirect:'/inbox'
    },
  ]
})

router.beforeEach((to, _, next) => {
  const publicRoutes: RouteRecordNameGeneric[] = ['login', 'register', 'forgot-password']

  store.commit(MutationTypes.LOGIN.SET_AUTH)

  const isPublicRoute = publicRoutes.includes(to.name)

  if (isPublicRoute && store.getters.isUserAuth) {
    return next({ name: 'home' })
  }

  if (!isPublicRoute && (!store.getters.isUserAuth || !store.getters.userId)) {
    return next({ name: 'login' })
  }

  if (isPublicRoute && store.state.stompClient != null) {
    store.state.stompClient.disconnect()

    store.commit(MutationTypes.SET_STOMP_CLIENT, null)
  }

  next()
})

export default router
