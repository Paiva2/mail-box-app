<template>
  <action-bar :filters="filters" @update:pagination="updatePagination" />

  <div class="d-flex">
    <email-list
      pageTitle="Inbox"
      :request="request"
      :isLoadingOrEmpty="isLoadingOrEmpty"
      :loading="loading"
      @update:selectEmailPreview="selectEmailToPreview"
      @update:loadMore="loadMore"
    >
      <template v-slot:fallback>
        <v-empty-state
          headline="Nothing here..."
          text="You haven't received any e-mails yet. When you do, they'll appear here."
          title="Check back later."
          icon="mdi-email-off"
        />
      </template>
    </email-list>

    <router-view />
  </div>
</template>

<script>
import ActionBar from './components/actionBar/ActionBar'
import EmailList from '@/components/emailList/EmailList'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { RouterView } from 'vue-router';
import { mapState } from 'vuex'

export default {
  name: 'Inbox',
  components: {
    EmailList,
    ActionBar
  },
  data() {
    return {
      filters: {
        searchValue: '',
      },
      request: {
        page: 1,
        perPage: 15,
        totalElements: 0,
        totalPages: 1,
      },
      loading: false
    }
  },
  computed: {
    ...mapState(['emailList']),
    isLoadingOrEmpty() {
      return (this.loading || !this.emailList.length) ? 'hide' : ''
    }
  },
  async mounted() {
    await this.getInboxMails(this.request.page, this.request.perPage)
  },
  created() {
    this.$store.commit(MutationTypes.EMAIL.SET_LIST, [])
    this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, null)
  },
  methods: {
    updatePagination(payload) {
      this.request = {
        ...this.request,
        ...payload
      }
    },
    async getInboxMails(page, perPage) {
      this.loading = true

      try {
        const inboxMails = await this.$store.dispatch(ActionTypes.GET_LIST.INBOX, {
          page: page,
          perPage: perPage,
          flag: 'inbox',
          keyword: this.filters.searchValue
        })

        this.updatePagination({
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
        console.error(e)
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
