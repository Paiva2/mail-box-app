import { MutationTree } from 'vuex'
import { MutationTypes } from './types/mutation-types'
import { State } from './state'
import Cookies from 'js-cookie'
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const mutations: MutationTree<State> = {
  [MutationTypes.LOGIN.SET_AUTH](state) {
    const authToken = Cookies.get('mail-box-auth') || null
    let subject: null | number = null

    if (authToken != null) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(authToken);

        subject = Number(decodedToken.sub) || null
      } catch {
        Cookies.remove('mail-box-auth', { path: '/' })
        console.error('There was an error while verifying the auth token...')
      }
    }

    state.auth = { ...state.auth, token: authToken, subject }
  },
  [MutationTypes.LOGIN.SET_LOGOUT](state) {
    Cookies.remove('mail-box-auth')

    state.auth =  {
      token: null,
      subject: null,
    }
  },
  [MutationTypes.USER.SET_PROFILE](state, payload) {
    state.profile = {
      ...state.profile,
      ...payload
    }
  },
  [MutationTypes.SET_STOMP_CLIENT](state, payload) {
    state.stompClient = payload
  },
  [MutationTypes.SET_LOADING_EMAIL_LIST](state, payload) {
    state.loadingEmailList = payload
  },
  [MutationTypes.EMAIL.SELECTED_ID](state, payload) {
    state.selectedEmailId = payload
  },
  [MutationTypes.EMAIL.SET_LIST](state, payload) {
    state.emailList = payload
  },
  [MutationTypes.EMAIL.LIST.INSERT](state, payload) {
    state.emailList = [payload, ...state.emailList]
  },
  [MutationTypes.EMAIL.SELECTED_EMAIL](state, payload) {
    state.emailBeingVisualized = payload
  }
}
