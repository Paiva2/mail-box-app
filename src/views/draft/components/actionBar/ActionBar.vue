<template>
  <v-app-bar :elevation="1" height="42">
    <div class="d-flex actions-wrapper">
      <div class="actions d-flex">
        <v-btn :disabled="loading" @click="openSendDraft" tile v-if="!!emailBeingVisualized?.id">
          <v-icon color="blue-darken-1" class="mr-1">
            mdi-send
          </v-icon>
          Send e-mail
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
          v-model="filters.searchValue"
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

    <send-draft-form
      :key="newEmailForm.open"
      :formFields="formFields"
      :newEmailForm="newEmailForm"
      @update:list="refetchDraftList"
      @update:close="closeForm"
    />
  </v-app-bar>
</template>

<script>
import api from '@/lib/axios'
import { useToast } from "vue-toastification";
import {mapState} from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import SendDraftForm from '../sendDraftForm/SendDraftForm'

export default {
  name: 'ActionBar',
  setup() {
    const toast = useToast();

    return { toast };
  },
  components: {
    SendDraftForm
  },
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['auth', 'emailBeingVisualized']),
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
      searching: false,
      loading: false,
      formFields: {
        title: '',
        message: '',
        toList: [],
        copiesList: [],
        attachments: [],
        openingOrder: false,
      },
    }
  },
  methods: {
    openSendDraft() {
      this.formFields.title = this.emailBeingVisualized?.title ?? ''
      this.formFields.message = this.emailBeingVisualized?.message ?? ''
      this.newEmailForm.open = true
    },
    async sendDraft() {
      const emailId = this.$route.params.emailId

      this.loading = true

      try {
        await api.patch(`/email/draft/send/email/${emailId}`, {
          toEmails: this.formFields.toList,
          openingOrders: this.formFields.openingOrder,
          copyList: this.formFields.copiesList
        },
        {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        this.toast.success('Send successfully!')
        this.$router.push({ name: 'noEmailSelectedDraft' })
      } catch {
        console.error("Error while sending... Try again.")
        this.toast.error('Error while sending... Try again!')
      } finally {
        this.loading = false
      }

      await this.refetchDraftList()
    },
    closeForm() {
      this.newEmailForm.open = false
      this.formFields = {
        title: '',
        message: '',
        toList: [],
        copiesList: [],
        attachments: [],
        openingOrder: false,
      }
    },
    async handleSearch() {
      if (!this.openSearch) {
        this.openSearch = true
        return
      } else if (!this.filters.searchValue) {
        this.openSearch = false

        if (this.searching) {
          this.searching = false
          await this.refetchDraftList(this.filters.searchValue)
        }
        return
      }

      await this.refetchDraftList(this.filters.searchValue)
      this.searching = true
    },
    async deleteEmail() {
      const emailId = this.$route.params.emailId

      this.loading = true

      try {
        await api.delete(`/email/draft/delete/email/${emailId}`,{
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        await this.refetchDraftList()

        this.toast.success('Deleted successfully!')
        this.$router.push({ name: 'noEmailSelectedDraft' })
      } catch(e) {
        console.error(e)
        console.error("Error while deleting... Try again.")
        this.toast.error('Error while deleting... Try again!')
      } finally {
        this.loading = false
      }
    },
    async refetchDraftList(keyword = null) {
      const params = {
        page: 1,
        perPage: 15,
      }

      if (keyword !== null) {
        params.keyword = keyword
      }

      const draftMails = await this.$store.dispatch(ActionTypes.GET_LIST.DRAFT, params)

      this.$store.commit(MutationTypes.EMAIL.SET_LIST, draftMails.emails)

      this.$emit('update:pagination', {
        ...this.request,
        page: draftMails.page,
        perPage: draftMails.size,
        totalElements: draftMails.totalItems,
        totalPages: draftMails.totalPages
      })
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

