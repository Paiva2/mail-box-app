<template>
  <action-bar />

  <div class="d-flex">
    <email-list />
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
  }
}
</script>

<style scoped>

</style>
