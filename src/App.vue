<template>
  <v-app>
    <v-main class="main d-flex">
      <side-bar v-if="isUserAuth" />
      <email-action-bar v-if="isUserAuth" />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router';
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { mapGetters, mapState } from 'vuex'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import EmailActionBar from '@/components/emailActionBar/EmailActonBar'
import SideBar from '@/components/sideBar/SideBar'
import Stomp from 'stompjs'
import SockJs from "sockjs-client/dist/sockjs"
import { useToast } from "vue-toastification";

export default {
  name: 'App',
  components: {
    EmailActionBar,
    SideBar,
    RouterView,
  },
  setup() {
    const toast = useToast();

    return { toast };
  },
  computed: {
    ...mapGetters(['isUserAuth']),
    ...mapState(['profile', 'auth', 'stompClient', 'emailList']),
  },
  async created() {
    await this.fillAuthToken()
  },
  watch: {
    async 'isUserAuth'() {
      await this.handleAuthConnections()
    }
  },
  methods: {
    async fillAuthToken() {
      this.$store.commit(MutationTypes.LOGIN.SET_AUTH)
    },
    async handleAuthConnections() {
      if (this.isUserAuth) {
        await this.$store.dispatch(ActionTypes.SET_PROFILE)
        this.makeConnectionInbox()
      }
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

      this.stompClient.debug = () => {};
    },
    connectionError() {
      console.error('Error while connecting on WS...')
    },
    subscribeToConnection () {
      this.stompClient.subscribe(`/queue/inbox/${this.profile.email}`, this.emailReceived)
    },
    emailReceived(payload) {
      this.toast.warning(`New e-mail received!`);
      const parseNewEmail = JSON.parse(payload.body)

      this.$store.commit(MutationTypes.EMAIL.LIST.INSERT, {
        id: parseNewEmail.id,
        emailOwnerPicture: parseNewEmail.fromProfilePicture,
        subject: parseNewEmail.title,
        emailOwnerName: parseNewEmail.fromName,
        message: parseNewEmail.message,
      })
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

  .main {
    flex-direction: column;
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
