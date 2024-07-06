<template>
  <div>
    <side-bar />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import SideBar from './components/sideBar/SideBar'

export default {
  name: 'Home',
  components: {
    SideBar
  },
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
