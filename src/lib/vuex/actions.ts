import api from '../axios'
import { ActionTypes } from './types/action-types'
import { MutationTypes } from './types/mutation-types'

export const actions = {
  async [ActionTypes.SET_PROFILE]({ commit }: { commit: Function }, payload: { token: string }) {

    const profile = await api.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    })

    commit(MutationTypes.USER.SET_PROFILE, profile.data)
  },
}
