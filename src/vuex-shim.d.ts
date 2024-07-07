import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { state } from './lib/vuex/state'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<typeof state>
  }
}
