<template>
  <action-bar :filters="filters" @update:pagination="updatePagination" />

  <div class="d-flex">
    <email-list
      pageTitle="Sent"
      :request="request"
      :isLoadingOrEmpty="isLoadingOrEmpty"
      :loading="loading"
      @update:selectEmailPreview="selectEmailToPreview"
      @update:loadMore="loadMore"
    >
      <template v-slot:fallback>
        <v-empty-state
          headline="Nothing here..."
          text="You haven't sent any e-mails yet. When you do, they'll appear here."
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
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import { RouterView } from 'vue-router';

export default {
  name: 'Sent',
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
    isLastPage() {
      return this.request.page === this.request.totalPages
    },
    isLoadingOrEmpty() {
      return (this.loading || !this.emailList.length) ? 'hide' : ''
    }
  },
  async mounted() {
    await this.getSentEmails(this.request.page, this.request.perPage)
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
    async getSentEmails(page, perPage) {
      this.loading = true

      try {
        const sentEmails = await this.$store.dispatch(ActionTypes.GET_LIST.SENT, {
          page: page,
          perPage: perPage,
          keyword: this.filters.searchValue
        })

        this.updatePagination({
          ...this.request,
          page: sentEmails.page,
          perPage: sentEmails.size,
          totalElements: sentEmails.totalItems,
          totalPages: sentEmails.totalPages
        })

        let currentEmails = []

        if (this.emailList.length > 0) {
          currentEmails = this.emailList.concat(sentEmails.emails)
        } else {
          currentEmails = sentEmails.emails
        }

        currentEmails.forEach(email => {
          email.emailOwnerPicture = this.profile?.profilePicture
        })

        this.$store.commit(MutationTypes.EMAIL.SET_LIST, currentEmails)
      } catch {
        console.error('Error while fetching sent e-mails...')
      } finally {
        this.loading = false
      }
    },
    selectEmailToPreview(emailId) {
      this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, emailId)
      this.$router.push({ name: 'emailSent', params: { emailId: emailId }  })
    },
    async loadMore({done}) {
        await this.getSentEmails(this.request.page + 1, this.request.perPage)
        done()
    }
  }
}
</script>

<style scoped>

</style>
