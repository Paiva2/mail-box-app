<template>
  <div class="fallback-wrapper text-center">
    <p class="font-weight-regular text-grey-darken-3">Select an e-mail to preview</p>
    <v-icon color="blue-grey-lighten-4" size="80">mdi-email-open-outline</v-icon>
    <p class="font-weight-light text-grey-darken-2">No e-mail selected</p>
  </div>
</template>

<script>
import Stomp from 'stompjs'
import SockJs from "sockjs-client/dist/sockjs"
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { mapState, mapGetters } from 'vuex'
import { useToast } from "vue-toastification";

export default {
  name: 'HomeArea',
  setup() {
    const toast = useToast();

    return { toast };
  },
  computed: {
  ...mapState(['profile', 'auth', 'stompClient', 'emailList']),
  ...mapGetters(['isUserAuth'])
  },
  async created() {
    await this.setProfile()
    this.makeConnectionInbox()
  },
  methods: {
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
    async setProfile() {
      await this.$store.dispatch(ActionTypes.SET_PROFILE)
    },
  }
}

</script>

<style scoped>
  .fallback-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    flex-direction: column;
    gap: .9375rem;
    background-color: transparent;
  }

  .fallback-wrapper p {
    font-size: 1rem;
  }
</style>
