<template>
  <div class="d-flex contacts-container">
    <p class="text-h4 text-grey-darken-2 font-weight-medium">Contacts</p>

    <v-data-table
      :headers="headers"
      :items="desserts"
      item-value="name"
      items-per-page="5"
      hide-default-footer
      hover
    >
      <template v-slot:top>
        <v-text-field
          v-model="searchValue"
          class="pa-3"
          label="Search"
          color="blue-darken-1"
          variant="underlined"
          prepend-icon="mdi-magnify"
        ></v-text-field>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'

export default {
  name: 'Contacts',
  data () {
    return {
      headers: [
        { title: 'Name', align: 'start', key: 'name', sortable: false },
        { title: 'E-mail', align: 'center', key: 'email', sortable: false  },
        { title: 'Created in', align: 'end', key: 'createdAt', sortable: false  },
      ],
      contacts: [
        {
          calories: 159,
          fat: 6.0,
          carbs: 24,
        },
        {
          calories: 237,
          fat: 9.0,
          carbs: 37,
        },
        {
          calories: 262,
          fat: 16.0,
          carbs: 23,
        },
        {
          calories: 305,
          fat: 3.7,
          carbs: 67,
        },
        {
          calories: 356,
          fat: 16.0,
          carbs: 49,
        },
        {
          calories: 375,
          fat: 0.0,
          carbs: 94
        },
        {
          calories: 392,
          fat: 0.2,
          carbs: 98,
        },
        {
          calories: 408,
          fat: 3.2,
          carbs: 87,

        },
        {
          calories: 452,
          fat: 25.0,
          carbs: 51,

        },
        {
          calories: 518,
          fat: 26.0,
          carbs: 65,
        },
      ],
      pagination: {
        page: 1,
        perPage: 15,
        keyword: '',
      },
      searchValue: ''
    }
  },
  async created() {
    await this.getContactsList(this.pagination.page, this.pagination.perPage, this.pagination.keyword)
  },
  methods: {
    async getContactsList(page, perPage, keyword) {
      const list = await this.$store.dispatch(ActionTypes.GET_LIST.CONTACTS, {
        page,
        perPage,
        keyword
      })
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
</style>
