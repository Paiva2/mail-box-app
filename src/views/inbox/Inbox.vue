<template>
  <div class="d-flex">
    <email-list />
    <router-view />
  </div>
</template>

<script>
import EmailList from './components/emailList/EmailList'
import { RouterView } from 'vue-router';

export default {
  name: 'Inbox',
  components: {
    EmailList
  }
}
</script>

<style scoped>

</style>
