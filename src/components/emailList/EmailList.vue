<template>
  <v-card
    max-width="450"
    class="mail-list-wrapper"
    elevation="2"
    tile
  >
    <template v-slot:subtitle>
      <h1 class="text-h6">Inbox</h1>
    </template>

    <v-list lines="two" class="list-items pt-0">
      <v-list-item :disabled="loadingEmailList" v-for="(email, index) in emails" :key="email.id" class="pa-0">
        <v-btn
          selected-class="selected"
          v-ripple="{ class: `text-info` }"
          tile
          class="mail-button w-100 d-flex text-start font-weight-regular"
          :class="email.id === selectedEmailId ? 'selected' : ''"
          height="64"
          elevation="0"
          @click="selectEmailToPreview(email.id)"
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
</template>

<script>
import { mapState } from 'vuex'
import api from '@/lib/axios'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'

export default {
  name: 'EmailList',
  data() {
    return {
      emails: [],
      request: {
        page: 1,
        perPage: 15,
        totalElements: 0,
        searchFor: '',
        totalPages: 1,
      },
      selectedEmail: null,
    }
  },
  computed: {
    ...mapState(['auth', 'loadingEmailList', 'selectedEmailId']),
  },
  async mounted() {
    await this.getInboxMails()
  },
  methods: {
    async getInboxMails() {
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
      } catch (e) {
        console.error('Error while fetching Inbox e-mails...')
      }
    },
    selectEmailToPreview(emailId) {
      this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, emailId)
      this.$router.push({ name: 'email', params: { emailId: emailId }  })
    }
  }
}
</script>

<style scoped>
  .mail-button >>> .v-btn__content {
    min-width: 100%;
    justify-content: start;
  }
</style>
