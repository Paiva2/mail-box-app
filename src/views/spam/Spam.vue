<template>
  <action-bar :filters="filters" @update:pagination="updatePagination" />

  <div class="d-flex">
    <email-list
      pageTitle="Spam"
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
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { RouterView } from 'vue-router';
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { mapState } from 'vuex'

export default {
  name: 'Spam',
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
    await this.getSpamEmails(this.request.page, this.request.perPage)
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
    async getSpamEmails(page, perPage) {
      this.loading = true

      try {
        const spamMails = await this.$store.dispatch(ActionTypes.GET_LIST.SPAM, {
          page: page,
          perPage: perPage,
          flag: 'inbox',
          keyword: this.filters.searchValue
        })

        this.updatePagination({
          ...this.request,
          page: spamMails.page,
          perPage: spamMails.size,
          totalElements: spamMails.totalItems,
          totalPages: spamMails.totalPages
        })

        let currentEmails = []

        if (this.emailList.length > 0) {
          currentEmails = this.emailList.concat(spamMails.emails)
        } else {
          currentEmails = spamMails.emails
        }

        this.$store.commit(MutationTypes.EMAIL.SET_LIST, currentEmails)
      } catch (e) {
        console.error('Error while fetching spam e-mails...')
      } finally {
        this.loading = false
      }
    },
    selectEmailToPreview(emailId) {
      this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, emailId)
      this.$router.push({ name: 'emailSpam', params: { emailId: emailId }  })
    },
    async loadMore({done}) {
        await this.getSpamEmails(this.request.page + 1, this.request.perPage)
        done()
    }
  }
}
</script>
