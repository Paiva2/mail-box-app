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
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['auth']),
  },
  async created() {
    this.fillAuthToken()
  },
  methods: {
    fillAuthToken() {
      this.$store.commit(MutationTypes.LOGIN.SET_AUTH)
    },
  }
}
</script>
