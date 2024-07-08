<template>
  <v-app>
    <v-main>
      <side-bar v-if="isUserAuth" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router';
import SideBar from '@/components/sideBar/SideBar'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['auth']),
    ...mapGetters(['isUserAuth'])
  },
  created() {
    this.fillAuthToken()
  },
  methods: {
    fillAuthToken() {
      this.$store.commit(MutationTypes.LOGIN.SET_AUTH)
    },
  }
}
</script>
