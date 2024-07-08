import { AxiosError } from 'axios'
import api from '../axios'
import { State } from './state'
import { ActionTypes } from './types/action-types'
import { MutationTypes } from './types/mutation-types'
import Cookies from 'js-cookie'

interface ActionDefault {
  commit: Function,
  state: State
}

export const actions = {
  async [ActionTypes.SET_PROFILE]({ commit, state }: ActionDefault) {
    try {
      const profile = await api.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${state.auth.token}`
        }
      })

      commit(MutationTypes.USER.SET_PROFILE, profile.data)
    } catch(e) {
      if(e instanceof AxiosError) {
        console.error(e.response?.data.message)
        Cookies.remove('mail-box-auth', { path: '/' })
      }
    }
  },
}
