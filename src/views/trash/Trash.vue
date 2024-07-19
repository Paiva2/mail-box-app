<template>
  <action-bar :filters="filters" @update:pagination="updatePagination" />

  <div class="d-flex">
    <email-list
      pageTitle="Trash"
      :request="request"
      :isLoadingOrEmpty="isLoadingOrEmpty"
      :loading="loading"
      @update:selectEmailPreview="selectEmailToPreview"
      @update:loadMore="loadMore"
    >
      <template v-slot:fallback>
        <v-empty-state
          headline="Nothing here..."
          text="You haven't deleted any e-mails yet. When you do, they'll appear here."
          title="Check back later."
          icon="mdi-email-remove"
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
  name: 'Trash',
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
    await this.getTrashEmails(this.request.page, this.request.perPage)
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
    async getTrashEmails(page, perPage) {
      this.loading = true

      try {
        const trashEmails = await this.$store.dispatch(ActionTypes.GET_LIST.TRASH, {
          page: page,
          perPage: perPage,
          keyword: this.filters.searchValue
        })

        this.updatePagination({
          ...this.request,
          page: trashEmails.page,
          perPage: trashEmails.size,
          totalElements: trashEmails.totalItems,
          totalPages: trashEmails.totalPages
        })

        let currentEmails = []

        if (this.emailList.length > 0) {
          currentEmails = this.emailList.concat(trashEmails.emails)
        } else {
          currentEmails = trashEmails.emails
        }

        this.$store.commit(MutationTypes.EMAIL.SET_LIST, currentEmails)
      } catch {
        console.error('Error while fetching trash e-mails...')
      } finally {
        this.loading = false
      }
    },
    selectEmailToPreview(emailId) {
      this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, emailId)
      this.$router.push({ name: 'emailTrash', params: { emailId: emailId }  })
    },
    async loadMore({done}) {
        await this.getTrashEmails(this.request.page + 1, this.request.perPage)
        done()
    }
  }
}
</script>
