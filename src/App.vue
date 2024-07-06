<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router';
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['auth']),
  },
  async created() {
    this.fillAuthToken()
    await this.fillProfile()
  },
  methods: {
    fillAuthToken() {
      this.$store.commit(MutationTypes.LOGIN.SET_AUTH)
    },
    async fillProfile() {
      if(this.auth.token === null) return

      await this.$store.dispatch(ActionTypes.SET_PROFILE, this.auth)
    }
  }
}
</script>
