<template>
  <div class="d-flex mail-inbox-wrapper">
    <email-action-bar />

    <div class="mail-inbox d-flex">
      <v-card
        max-width="450"
        class="mail-list-wrapper"
        elevation="2"
        tile
      >

      <v-btn @click="triggerNewEmail">Teste</v-btn>

      <template v-slot:subtitle>
        <h1 class="text-h6">Inbox</h1>
      </template>

        <v-list lines="two" class="list-items pt-0">
          <v-list-item v-for="(email, index) in emails" :key="email.id" class="pa-0">
            <v-btn
              selected-class="selected"
              v-ripple="{ class: `text-info` }"
              tile class="mail-button w-100 d-flex text-start font-weight-regular"
              height="64"
              elevation="0"
            >
              <v-avatar class="mr-3" :image="email.emailOwnerPicture ?? profile.defaultProfilePicture" color="surface-variant" />

              <div class="d-flex btn-content-wrapper">
                <p class="mb-1 text-body-1">{{ email.subject }}</p>

                <div class="btn-content-texts">
                  <span class="text-primary">{{ email.emailOwnerName }}</span> &mdash;
                  <span>{{ email.message }}</span>
                </div>
              </div>
            </v-btn>

            <v-divider v-if="index < emails.length - 1"></v-divider>
        </v-list-item>
        </v-list>
      </v-card>

      <email-preview />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import EmailActionBar from '@/components/emailActionBar/EmailActonBar'
import EmailPreview from '@/components/emailPreview/EmailPreview'
import Stomp from 'stompjs'
import SockJs from "sockjs-client/dist/sockjs"
import api from '@/lib/axios'

export default {
  name: 'Inbox',
  components: {
    EmailActionBar,
    EmailPreview
  },
  data() {
    return {
      emails: [],
      loadingInbox: false,
      request: {
        page: 1,
        perPage: 15,
        totalElements: 0,
        searchFor: '',
        totalPages: 1,
      }
    }
  },
  computed: {
    ...mapState(['profile', 'auth', 'stompClient']),
  },
  async created() {
    await this.setProfile()
  },
  async mounted() {
    await this.getInboxMails()
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
    },
    connectionError() {
      console.error('Error while connecting on WS...')
    },
    subscribeToConnection (frame) {
      this.stompClient.subscribe(`/queue/inbox/${this.profile.email}`, this.emailReceived)
    },
    triggerNewEmail(frame) {
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
    async getInboxMails() {
        this.loadingInbox = true

        try {
          const inboxMails = await api.get(`/email/inbox?page=${this.request.page}&size=${this.request.perPage}&flag=inbox`, {
            headers: {
              Authorization: `Bearer ${this.auth.token}`
            }
          })

          this.request = {
            ...this.request,
            page: inboxMails.data.page,
            perPage: inboxMails.data.size,
            totalElements: inboxMails.data.totalItems,
            totalPages: inboxMails.data.totalPages
          }

          this.emails = inboxMails.data.emails
        } catch (e){
          console.error('Error while fetching Inbox e-mails...')
        } finally {
          this.loadingInbox = false
        }
    },
    async setProfile() {
      await this.$store.dispatch(ActionTypes.SET_PROFILE)
    },
  },
}
</script>

<style scoped>
  .mail-inbox-wrapper {
      width: 100%;
      height: 100%;
      flex-direction: column;
    }

    .mail-inbox {
      justify-content: start;
      width: 100%;
    }

    .mail-list-wrapper {
      height: calc(100vh - 44px);
      overflow-y: auto;
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
