<template>
  <div class="d-flex mail-inbox-wrapper">
    <email-action-bar />

    <div class="mail-inbox d-flex">
      <v-card
        max-width="450"
        class="mail-list-wrapper"
        elevation="2"
      >

      <template v-slot:subtitle>
        <h1 class="text-h6">Inbox</h1>
      </template>

        <v-list lines="two" class="list-items pt-0">
          <v-list-item v-for="(item, index) in items" :key="index" class="pa-0">
            <v-btn
              selected-class="selected"
              v-ripple="{ class: `text-info` }"
              tile class="mail-button w-100 d-flex text-start font-weight-regular"
              height="64"
              elevation="0"
            >
              <v-avatar class="mr-3" :image="item.prependAvatar" color="surface-variant" />

              <div class="d-flex btn-content-wrapper">
                <p class="mb-1 text-body-1">{{ item.title }}</p>

                <div class="btn-content-texts">
                  <span class="text-primary">Ali Connors</span> &mdash;
                  <span>{{ item.message }}</span>
                </div>
              </div>
            </v-btn>

            <v-divider v-if="index < items.length - 1"></v-divider>
        </v-list-item>
        </v-list>
      </v-card>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import EmailActionBar from '@/components/emailActionBar/EmailActonBar'

export default {
  name: 'Inbox',
  components: {
    EmailActionBar
  },
  data() {
    return {
      items: [
        {
          type: 'button',
          id: 1,
          class: 'mail-opened',
          value: 'test',
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          message: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        {
          type: 'button',
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ',
          message: `Wish I could come, but I'm out of town this weekend.`,
        },
        {
          type: 'button',
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          message: 'Do you have Paris recommendations? Have you ever been?',
        },
        {
          type: 'button',
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          title: 'Birthday gift',
          message: 'Have any ideas about what we should get Heidi for her birthday?',
        },
      ],
    }
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
.mail-inbox-wrapper {
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.mail-inbox {
  justify-content: start;
  width: 100%;
  flex-direction: column;
}

.mail-list-wrapper {
  height: calc(100vh - 44px);
  overflow-y: auto;
}

.mail-button > * {
  max-width: 100%;
}

.mail-button {
  text-transform: none;
  letter-spacing: normal;
}

.mail-button.selected {
  background-color: #BBDEFB
}

.btn-content-wrapper {
  flex-direction: column;
  overflow: hidden;
}

.btn-content-texts {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
