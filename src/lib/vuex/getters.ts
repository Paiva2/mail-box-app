import { GetterTree } from 'vuex'
import { State } from './state'

export type Getters = {
  isUserAuth(state: State): boolean
}

export const getters: GetterTree<State, State> & Getters = {
  isUserAuth: (state) => {
    return state.auth.token != null
  },
}
