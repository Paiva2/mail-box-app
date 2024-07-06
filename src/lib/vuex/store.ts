import { getters} from "./getters";
import { state } from "./state";
import { mutations } from "./mutations";
import { actions } from "./actions";
import { createStore } from 'vuex'

export const store = createStore({
  state,
  getters,
  mutations,
  actions,
})
