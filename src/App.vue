<template>
  <v-app>
    <v-main class="d-flex">
      <side-bar v-if="isUserAuth" />

      <div class="mail-inbox-wrapper d-flex">
        <email-action-bar v-if="isUserAuth" />

        <div class="d-flex">
          <email-list v-if="isUserAuth" />

          <router-view />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router';
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { mapGetters } from 'vuex'
import EmailActionBar from '@/components/emailActionBar/EmailActonBar'
import EmailList from '@/components/emailList/EmailList'
import SideBar from '@/components/sideBar/SideBar'

export default {
  name: 'App',
  components: {
    EmailActionBar,
    SideBar,
    RouterView,
    EmailList
  },
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

  .mail-inbox-wrapper {
    justify-content: start;
    width: 100%;
    flex-direction: column
  }

  .mail-list-wrapper {
    height: calc(100vh - 44px);
    overflow-y: auto;
    min-width: 27.1875rem;
  }

  .mail-button > * {
    max-width: 100%;
  }

  .mail-button {
    text-transform: none;
    letter-spacing: normal;
  }

  .mail-button.selected {
    background-color: #BBDEFB
  }

  .btn-content-wrapper {
    flex-direction: column;
    overflow: hidden;
  }

  .btn-content-texts {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
