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
import Stomp from 'stompjs'
import SockJS from "sockjs-client/dist/sockjs"

export default {
  name: 'App',
  computed: {
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

<style>
  body {
    font-family: 'Open Sans', 'sans-serif';
    box-sizing: border-box
  }

  * {
    letter-spacing: normal !important;
  }
</style>
