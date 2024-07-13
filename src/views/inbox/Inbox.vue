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
import { RouterView } from 'vue-router';

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
        searchFor: '',
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
