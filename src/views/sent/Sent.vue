<template>
  <action-bar :filters="filters" @update:pagination="updatePagination" />

  <div class="d-flex">
    <email-list :filters="filters" :request="request" @update:pagination="updatePagination" />
    <router-view />
  </div>
</template>

<script>
import ActionBar from './components/actionBar/ActionBar'
import EmailList from './components/emailList/EmailList'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { RouterView } from 'vue-router';

export default {
  name: 'Sent',
  components: {
    EmailList,
    ActionBar
  },
  created() {
    this.$store.commit(MutationTypes.EMAIL.SET_LIST, [])
    this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, null)
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
    }
  },
  methods: {
    updatePagination(payload) {
      this.request = {
        ...this.request,
        ...payload
      }
    }
  }
}
</script>

<style scoped>

</style>
