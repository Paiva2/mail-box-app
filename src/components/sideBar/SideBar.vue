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
      >
        <v-tooltip
          activator="parent"
          location="end"
          offset="-4"
        >
          Edit Profile
        </v-tooltip>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav color="blue-darken-3">
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.name"
        :value="item.value"
        @click="goTo(item.value)"
        :active="selectedMenu === item.value"
      />
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav color="blue-darken-3">
      <v-list-item
        class="py-2"
        prepend-icon="mdi-account-box"
        title="Contacts"
        value="contacts"
        :active="selectedMenu === 'contacts'"
        @click="goTo('contacts')"
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
    created() {
      this.$watch(
        () => this.$router.currentRoute.value.meta.fallBackName,
          (name) => {
            this.selectedMenu = name
          }
      )
    },
    data() {
      return {
        profileMenu: {
          open: false
        },
        selectedMenu: 'noEmailSelected',
        menuItems: [
          {name: 'Inbox', value: 'noEmailSelected', icon: 'mdi-inbox-arrow-down'},
          {name: 'Sent Mail', value: 'noEmailSelectedSent', icon: 'mdi-send'},
          {name: 'Spam', value: 'noEmailSelectedSpam', icon: 'mdi-alert-circle'},
          {name: 'Folders', value: 'folders', icon: 'mdi-folder'},
          {name: 'Important', value: 'important', icon: 'mdi-flag'},
          {name: 'Favourite', value: 'favourite', icon: 'mdi-star'},
          {name: 'Draft', value: 'draft', icon: 'mdi-file-document-edit'},
          {name: 'Trash', value: 'noEmailSelectedTrash', icon: 'mdi-delete'},
        ]
      }
    },
    methods: {
      handleProfileMenu() {
        this.profileMenu.open = !this.profileMenu.open
      },
      goTo(routeName) {
        this.selectedMenu = routeName
        this.$router.push({name: routeName})
      }
    }
  }
</script>

<style scoped>
</style>
