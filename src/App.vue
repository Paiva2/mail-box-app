<template>
  <v-app>
    <v-main class="d-flex">
      <template v-if="isUserAuth">
        <side-bar />

        <div class="mail-inbox-wrapper d-flex">
          <email-action-bar />

          <div class="d-flex">
            <email-list />

            <router-view />
          </div>
        </div>
      </template>
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router';
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { mapState, mapGetters } from 'vuex'
import EmailActionBar from '@/components/emailActionBar/EmailActonBar'
import EmailList from '@/components/emailList/EmailList'
import SideBar from '@/components/sideBar/SideBar'
import Stomp from 'stompjs'
import SockJs from "sockjs-client/dist/sockjs"

export default {
  name: 'App',
  components: {
    EmailActionBar,
    SideBar,
    RouterView,
    EmailList
  },
  computed: {
    ...mapState(['profile', 'auth', 'stompClient']),
    ...mapGetters(['isUserAuth'])
  },
  async created() {
    this.fillAuthToken()
    await this.setProfile()
  },
  async mounted() {
    this.makeConnectionInbox()
  },
  methods: {
    fillAuthToken() {
      this.$store.commit(MutationTypes.LOGIN.SET_AUTH)
    },
    makeConnectionInbox() {
      const sockJs = new SockJs('http://localhost:8080/ws')

      this.$store.commit(MutationTypes.SET_STOMP_CLIENT, Stomp.over(sockJs))

      this.stompClient.connect({
        WS_USER: JSON.stringify({
          id: this.auth.subject,
          email: this.profile.email,
          messageType: 'NEW_CONNECTION_INBOX'
        }),
      }, this.subscribeToConnection, this.connectionError)
    },
    connectionError() {
      console.error('Error while connecting on WS...')
    },
    subscribeToConnection () {
      this.stompClient.subscribe(`/queue/inbox/${this.profile.email}`, this.emailReceived)
    },
    triggerNewEmail() {
      console.log('Sending a new e-mail...')

      this.stompClient.send('/app/inbox', {} ,JSON.stringify({
        emailPayload: {
          openingOrders: false,
          copyList: [],
          message: 'lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum',
          subject: 'Novo e-mail',
          toEmails: ['paiva4@email.com']
        },
        messageType: 'NEW_EMAIL_INBOX'
      }))
    },
    emailReceived(payload) {
      console.log("E-mail recebido")
      console.log(payload)
    },
    async setProfile() {
      await this.$store.dispatch(ActionTypes.SET_PROFILE)
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
