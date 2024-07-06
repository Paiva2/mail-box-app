<template>
  <v-navigation-drawer
    expand-on-hover
    elevation="1"
    permanent
    rail
  >
    <v-list>
      <v-list-item
        class="py-2"
        :prepend-avatar="profile.profilePicture || profile.defaultProfilePicture"
        :subtitle="profile.email"
        :title="profile.name"
        @click="handleProfileMenu"
      />
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav color="blue-darken-3">
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.name"
        :value="item.value"
        @click="selectedMenu = item.value"
        :active="selectedMenu === item.value"
      />
    </v-list>

    <profile-menu
      :key="profileMenu.open"
      :profileMenu="profileMenu"
      @close-menu="handleProfileMenu"
    />
  </v-navigation-drawer>
</template>

<script>
import ProfileMenu from '../profileMenu/ProfileMenu'
import { mapState } from 'vuex'

  export default {
    name: 'SideBar',
    components: {
      ProfileMenu
    },
    computed: {
      ...mapState(['profile']),
    },
    data() {
      return {
        profileMenu: {
          open: false
        },
        selectedMenu: 'inbox',
        menuItems: [
          {name: 'Inbox', value: 'inbox', icon: 'mdi-inbox-arrow-down'},
          {name: 'Sent Mail', value: 'sent', icon: 'mdi-send'},
          {name: 'Spam', value: 'spam', icon: 'mdi-alert-circle'},
          {name: 'Folders', value: 'folders', icon: 'mdi-folder'},
          {name: 'Important', value: 'important', icon: 'mdi-flag'},
          {name: 'Favourite', value: 'favourite', icon: 'mdi-star'},
          {name: 'Draft', value: 'Draft', icon: 'mdi-file-document-edit'},
          {name: 'Trash', value: 'trash', icon: 'mdi-delete'},
        ]
      }
    },
    methods: {
      handleProfileMenu() {
        this.profileMenu.open = !this.profileMenu.open
      },
    }
  }
</script>

<style scoped>
</style>
