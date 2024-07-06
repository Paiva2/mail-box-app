<template>
  <div>
    Home
    Auth as: {{ profile.name }}
    <v-btn @click="$router.push({name: 'test'})">vai</v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ActionTypes } from '@/lib/vuex/types/action-types'

export default {
  name: 'Home',
  computed: {
    ...mapState(['profile']),
  },
  async created() {
    await this.setProfile()
  },
  methods: {
    async setProfile() {
     await this.$store.dispatch(ActionTypes.SET_PROFILE)
    }
  }
}
</script>

<style scoped>

</style>
