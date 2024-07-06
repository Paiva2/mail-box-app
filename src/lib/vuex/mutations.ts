import { MutationTree } from 'vuex'
import { MutationTypes } from './types/mutation-types'
import { State } from './state'
import Cookies from 'js-cookie'
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const mutations: MutationTree<State> = {
  [MutationTypes.LOGIN.SET_AUTH](state, _) {
    const authToken = Cookies.get('mail-box-auth') || null
    let subject = null

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
  [MutationTypes.USER.SET_PROFILE](state, payload) {
    state.profile = payload
  },
}
