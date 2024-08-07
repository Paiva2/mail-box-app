<template>
  <div class="d-flex contacts-container">
    <div class="d-flex align-center justify-space-between">
      <p class="text-h5 text-grey-darken-2 font-weight-medium">Contacts</p>

      <v-btn @click="openFormDialog" size="38" color="blue-darken-1" icon="mdi-plus" elevation="1">
      </v-btn>
    </div>

    <div>
      <v-data-table
        :page="pagination.page"
        :headers="headers"
        :items="contacts"
        :items-per-page="pagination.perPage"
        item-value="name"
        hide-default-footer
        hover
        class="elevation-1 pa-3"
      >
        <template v-slot:top>
          <v-text-field
            v-model="searchValue"
            class="pa-3"
            label="Search"
            color="blue-darken-1"
            variant="underlined"
            prepend-icon="mdi-magnify"
            @blur="handleSearch"
          />

          <div class="d-flex align-center w-100 justify-end">
              <p class="mr-3 font-weight-medium">Items per page: </p>
              <v-select
                :items="perPageOptions"
                v-model="pagination.perPage"
                @update:model-value="handlePagination"
                variant="solo"
                max-width="100"
                density="compact"
                hide-details
              />
          </div>
        </template>

        <template v-slot:no-data>
          <v-empty-state
            class="py-10"
            headline="Nothing here..."
            text="You haven't added any contacts yet. When you do, they'll appear here."
            title="Check back later."
          >
            <template v-slot:media>
              <v-icon class="mb-3" size="60">mdi-contacts</v-icon>
            </template>
          </v-empty-state>
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
            {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex w-100 justify-end actions-wrapper">
              <v-btn
                size="32"
                variant="tonal"
                color="blue-darken-4"
                icon="mdi-pencil"
                @click="openEdit(item)"
              />
              <v-btn
                size="32"
                variant="tonal"
                icon="mdi-delete"
                @click="openConfirmDelete(item)"
              />
            </div>
        </template>

        <template v-slot:bottom>
          <div class="text-center pt-8">
            <v-pagination
              v-model="pagination.page"
              :length="pagination.totalPages"
              active-color="blue-darken-1"
              size="45"
              :total-visible="5"
              elevation="1"
              @update:model-value="handlePagination"
            />
          </div>
        </template>
      </v-data-table>
    </div>

    <contact-form
      :editing="editing"
      :formFields="formFields"
      :openForm="openForm"
      :contactEditing="contactEditing"
      @update:close="closeForm"
      @update:list="updateList"
    />

    <confirm-delete
      :contact="contactToDelete"
      :openConfirmDeleteDialog="openConfirmDeleteDialog"
      @update:close="closeConfirmDelete"
      @update:list="updateList"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import ContactForm from './contactForm/ContactForm'
import ConfirmDelete from './confirmDelete/ConfirmDelete'

export default {
  name: 'Contacts',
  components: {
    ContactForm,
    ConfirmDelete
  },
  data () {
    return {
      openForm: false,
      formFields: {
        name: '',
        email: ''
      },
      contactEditing: null,
      headers: [
        { title: 'Name', align: 'start', key: 'name', sortable: false },
        { title: 'E-mail', align: 'center', key: 'email', sortable: false  },
        { title: 'Created in', align: 'end', key: 'createdAt', sortable: false  },
        { title: '', align: 'end', key: 'actions', sortable: false  },
      ],
      perPageOptions: ['5', '10', '15', '20'],
      contacts: [],
      pagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0
      },
      searchValue: '',
      searchingState: false,
      editing: false,
      openConfirmDeleteDialog: false,
      contactToDelete: null
    }
  },
  async created() {
    await this.getContactsList(this.pagination.page, this.pagination.perPage, this.searchValue)
  },
  methods: {
    async getContactsList(page, perPage, keyword) {
      const list = await this.$store.dispatch(ActionTypes.GET_LIST.CONTACTS, {
        page,
        perPage,
        name: keyword
      })

      this.contacts = list.contacts
      this.pagination = {
        ...this.pagination,
        page: list.page,
        perPage: list.size,
        totalItems: list.totalItems,
        totalPages: list.totalPages
      }
    },
    openFormDialog() {
      this.openForm = true
      this.editing = false
      this.formFields = {
        name: '',
        email: ''
      }
      this.contactEditing = null
    },
    closeForm() {
      this.openForm = false
    },
    formatDate(date) {
      return new Date(date)?.toLocaleDateString('en-US', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    },
    async updateList() {
      await this.getContactsList(1, 15, '')
    },
    openEdit(contact) {
      this.formFields = {
        name: contact.name,
        email: contact.email
      }

      this.contactEditing = {
        id: contact.id,
        name: contact.name,
        email: contact.email
      }

      this.editing = true
      this.openForm = true
    },
    openConfirmDelete(contact) {
      this.openConfirmDeleteDialog = true
      this.contactToDelete = contact
    },
    closeConfirmDelete() {
      this.openConfirmDeleteDialog = false
    },
    async handlePagination() {
      await this.getContactsList(this.pagination.page, this.pagination.perPage, this.searchValue)
    },
    async handleSearch() {
      if(!this.searchingState && !this.searchValue) return

      if(this.searchingState && !this.searchValue) {
        this.searchingState = false
      } else {
        this.searchingState = true
      }

      await this.getContactsList(this.pagination.page, this.pagination.perPage, this.searchValue)
    }
  }
}
</script>

<style scoped>
  .contacts-container {
    flex-direction: column;
    padding: 1.25rem;
    gap: .9375rem;
  }

  .actions-wrapper {
    gap: .625rem;
  }
</style>
