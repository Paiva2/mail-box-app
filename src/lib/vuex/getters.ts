import { GetterTree } from 'vuex'
import { State } from './state'

export type Getters = {
  isUserAuth(state: State): boolean
  userId(state: State): number | null
}

export const getters: GetterTree<State, State> & Getters = {
  isUserAuth: (state) => {
    return state.auth.token != null && state.auth.subject != null
  },
  userId: (state: State) => {
    return state.auth.subject
  }
}
