<template>
  <v-app-bar :elevation="1" height="42">
    <div class="d-flex actions-wrapper">
      <div class="actions d-flex">
        <v-btn :disabled="loading" @click="openNewEmailForm" tile>
          <v-icon color="blue-darken-1" class="mr-1">
            mdi-email
          </v-icon>
          New e-mail
        </v-btn>

        <v-btn :disabled="disableButtons" tile>
          <v-icon color="yellow-darken-4" class="mr-1">
            mdi-archive
          </v-icon>
          Archive
        </v-btn>

        <v-btn :disabled="disableButtons" @click="deleteEmail" tile>
          <v-icon color="red-darken-2" class="mr-1">
            mdi-delete
          </v-icon>
          Delete
        </v-btn>
      </div>

      <div class="d-flex search">
        <v-text-field
          density="compact"
          variant="underlined"
          hide-details
          color="blue-darken-1 text-body-3"
          class="text-body-2 search-input"
          :class="searchVisible"
          single-line
          v-model="searchValue"
        >
          <template v-slot:label>
            <span class="text-body-2">Search e-mails</span>
          </template>
        </v-text-field>
        <v-btn
          :disabled="loading"
          @click=handleSearch
          class="search-trigger"
          tile
          icon="mdi-magnify"
        />
      </div>
    </div>

    <new-email :key="newEmailForm.open" :newEmailForm="newEmailForm" />
  </v-app-bar>
</template>

<script>
import NewEmail from '@/components/newEmail/NewEmail'
import api from '@/lib/axios'
import { useToast } from "vue-toastification";
import {mapState} from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'

export default {
  name: 'EmailActionBar',
  setup() {
    const toast = useToast();

    return { toast };
  },
  components: {
    NewEmail
  },
  computed: {
    ...mapState(['auth']),
    searchVisible() {
      return this.openSearch ? 'show' : ''
    },
    disableButtons() {
      return !this.$route.params.emailId || this.loading
    }
  },
  data() {
    return {
      newEmailForm: {
        open: false
      },
      openSearch: false,
      searchValue: '',
      loading: false
    }
  },
  methods: {
    openNewEmailForm() {
      this.newEmailForm.open = true
    },
    handleSearch() {
      if (!this.openSearch) {
        this.openSearch = true
        return
      } else if (!this.searchValue) {
        this.openSearch = false
        return
      }
    },
    async deleteEmail() {
      const emailId = this.$route.params.emailId

      this.loading = true

      try {
        await api.patch(`/trashbin/me/email/${emailId}`, {} ,{
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        const inboxMails = await this.$store.dispatch(ActionTypes.GET_LIST.INBOX, {
          page: 1,
          perPage: 15,
          flag: 'inbox',
        })

        this.$store.commit(MutationTypes.EMAIL.SET_LIST, inboxMails.emails)

        this.toast.success('Deleted successfully!')
        this.$router.push({ name: 'noEmailSelected' })
      } catch {
        console.error("Error while deleting... Try again.")
        this.toast.error('Error while deleting... Try again!')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  .actions-wrapper {
    width: 100%;
    height: 100%;
    justify-content: space-between
  }

  .actions-wrapper button {
    text-transform: none;
    font-weight: 400;
    height: 100%;
  }

  .actions {
    align-items: center;
  }

  .search {
    flex: 1;
    gap: .3125rem;
    max-width: 35%;
    justify-content: flex-end;
  }

  .search-input {
    transition: max-width 0.4s ease-in-out;
    max-width: 0;
    overflow: hidden
  }

  .search-input.show {
    max-width: 365px;
  }
</style>

