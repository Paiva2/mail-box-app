import { MutationTree } from 'vuex'
import { MutationTypes } from './types/mutation-types'
import { State } from './state'
import Cookies from 'js-cookie'

export const mutations: MutationTree<State> = {
  [MutationTypes.LOGIN.SET_AUTH](state, _) {
    const authToken = Cookies.get('mail-box-auth') || null

    state.auth = { token: authToken }
  },
  [MutationTypes.USER.SET_PROFILE](state, payload) {
    state.profile = payload
  },
}
