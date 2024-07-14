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

    <generic-loading v-if="loading" />

    <v-empty-state
      v-else-if="!emailList.length"
      headline="Nothing here..."
      text="You haven't received any e-mails yet. When you do, they'll appear here."
      title="Check back later."
      icon="mdi-email-off"
    />

    <v-infinite-scroll
      class="list"
      :class="isLoadingOrEmpty"
      mode="manual"
      @load="loadMore"
      color="blue-darken-1"
    >
      <v-list lines="two" class="list-items pt-0">
        <v-list-item :disabled="loadingEmailList" v-for="(email, index) in emailList" :key="email.id" class="pa-0">
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

          <v-divider v-if="index < emailList.length - 1"></v-divider>
        </v-list-item>
      </v-list>

      <template v-slot:load-more="{ props }">
        <v-btn
          v-if="this.request.totalPages > 1"
          :disabled="isLastPage"
          variant="outlined"
          v-bind="props"
          color="blue-darken-1"
        >Load more</v-btn>
      </template>
    </v-infinite-scroll>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import GenericLoading from '@/components/genericLoading/GenericLoading'
import api from '@/lib/axios'

export default {
  name: 'EmailList',
  components: {
    GenericLoading
  },
  props: {
    filters: {
      type: Object,
      required: true
    },
    request: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedEmail: null,
      loading: false
    }
  },
  computed: {
    ...mapState(['auth', 'loadingEmailList', 'selectedEmailId', 'emailList', 'profile']),
    isLastPage() {
      return this.request.page === this.request.totalPages
    },
    isLoadingOrEmpty() {
      return (this.loading || !this.emailList.length) ? 'hide' : ''
    }
  },
  async mounted() {
    await this.getInboxMails(this.request.page, this.request.perPage)
  },
  methods: {
    async getInboxMails(page, perPage) {
      this.loading = true

      try {
        const inboxMails = await this.$store.dispatch(ActionTypes.GET_LIST.INBOX, {
          page: page,
          perPage: perPage,
          flag: 'inbox',
          keyword: this.filters.searchValue
        })

        this.$emit('update:pagination', {
          ...this.request,
          page: inboxMails.page,
          perPage: inboxMails.size,
          totalElements: inboxMails.totalItems,
          totalPages: inboxMails.totalPages
        })

        let currentEmails = []

        if (this.emailList.length > 0) {
          currentEmails = this.emailList.concat(inboxMails.emails)
        } else {
          currentEmails = inboxMails.emails
        }

        this.$store.commit(MutationTypes.EMAIL.SET_LIST, currentEmails)
      } catch (e) {
        console.error('Error while fetching Inbox e-mails...')
      } finally {
        this.loading = false
      }
    },
    selectEmailToPreview(emailId) {
      this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, emailId)
      this.$router.push({ name: 'email', params: { emailId: emailId }  })
    },
    async loadMore({done}) {
        await this.getInboxMails(this.request.page + 1, this.request.perPage)
        done()
    }
  }
}
</script>

<style scoped>
  .mail-button:deep(.v-btn__content) {
    min-width: 100%;
    justify-content: start;
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

  .list.hide {
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    pointer-events: none;
  }
</style>
