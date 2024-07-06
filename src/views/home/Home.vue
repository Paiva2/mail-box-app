<template>
  <div>
    Home
    Auth as: {{ profile.name }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState(['profile'])
  }
}
</script>

<style scoped>

</style>
