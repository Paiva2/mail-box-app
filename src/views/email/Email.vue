<template>
  <div class="email-view-wrapper d-flex pa-2">
    <div class="email-title py-1">
      <h4 class="text-h6">
        {{ email.title }}
      </h4>
    </div>

    <div class="email-view elevation-1">
      <div class="email-info-bar d-flex">

        <div class="top-container d-flex pa-3">
          <div class="d-flex align-center">
            <div class="px-3">
              <v-avatar
                image="https://media.gq.com/photos/5601c28ef0075b5033a11aab/master/w_1600%2Cc_limit/paul-mccartney-gq-2015-sip-01.jpg"
                color="surface-variant"
              />
              <v-tooltip
                activator="parent"
                location="end"
                offset="-10"
              >
                {{ email.fromName }}
              </v-tooltip>
            </div>
            <div class="d-flex from-to-infos">
              <span class="text-body-1 text-grey-darken-1 font-weight-medium">
                {{ email.from }}
              </span>
              <span class="text-body-2 text-grey-darken-1 font-weight-regular to-list">
                <span class="text-grey-darken-1">To: </span>

                <template v-for="(receiving) in email.usersReceiving.join(', ')" :key="receiving">
                  {{ receiving }}
                </template>
              </span>

              <span v-if="!!email.copies?.length" class="text-body-2 text-grey-darken-1 font-weight-regular to-list">
                <span class="text-grey-darken-1">Copies: </span>
                <template v-for="(receiving) in email.copies.join(', ')" :key="receiving">
                  {{ receiving }}
                </template>
              </span>
            </div>
          </div>

          <v-menu v-if="!!email.attachments?.length">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue-darken-1"
                v-bind="props"
                icon="mdi-paperclip"
                size="35"
                variant="outlined"
              />
            </template>
            <v-list>
              <v-list-item
                v-for="(attachment) in email.attachments"
                :key="attachment.id"
                :value="attachment.url"
              >
                <v-list-item-title>{{ attachment.fileName }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-divider inset />

        <div class="message-box pa-5 pt-2">
          <p class="email-msg">
            {{ email.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/lib/axios'
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'

export default {
  data() {
    return {
      email: {
        id: '',
        hasOrder: null,
        opened: null,
        message: '',
        title: '',
        createdAt: null,
        from: '',
        fromName: '',
        usersReceiving: [],
        copies: [],
        attachments: [],
        isSpam: null,
      },
      items: [
        { title: 'img.jpg' },
        { title: 'file.pdf' },
      ],
    }
  },
  computed: {
    ...mapState(['auth', 'profile']),
  },
  async created() {
    await this.fetchEmail(this.$route.params.emailId)
    this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, this.$route.params.emailId)

    this.$watch(
      () => this.$route.params.emailId,
      async (newId) => {
        await this.fetchEmail(newId);
      }
    )
  },
  methods: {
    async fetchEmail(id) {
      this.$store.commit(MutationTypes.SET_LOADING_EMAIL_LIST, true)

      try {
        const email = await api.get(`/email/me/${id}`, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        this.email = {
          id: email.data.id,
          hasOrder: email.data.hasOrder,
          opened: email.data.opened,
          message: email.data.message,
          title: email.data.subject,
          createdAt: email.data.createdAt,
          from: email.data.sendFrom,
          fromName: email.data.sendFromName,
          usersReceiving: this.formatReceivingList(email.data.userReceivingEmailOutput),
          isSpam: email.data.isSpam,
          attachments: email.data.attachments,
          copies: this.formatReceivingList(email.data.ccs)
        }
      } catch {
        console.log("Error while fetching e-mail...")
      } finally {
        this.$store.commit(MutationTypes.SET_LOADING_EMAIL_LIST, false)
      }
    },
    formatReceivingList(list) {
      if (!list.length) return

      let fixListToGetMe = []
      const doesListHasMe = list.some(user => user.email === this.profile.email)

      if (doesListHasMe) {
        fixListToGetMe.push('You')
      }

      list.map(user => user.email).forEach(email => {
        if (email !== this.profile.email) {
          fixListToGetMe.push(email)
        }
      })

      return fixListToGetMe
    }
  }
}
</script>


<style scoped>
  .email-view-wrapper {
    flex: 1;
    height: 100%;
    flex-direction: column;
    gap: .5rem;
  }

  .email-title {
    background-color: #fff;
    width: 100%;
    text-align: center;
  }

  .email-view {
    background-color: #fff;
    height: max-content;
    overflow-y: auto;
    width: 100%;
    max-height: 40.625rem;
  }

  .email-info-bar {
    flex-direction: column;
  }

  .top-container {
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .from-to-infos {
    flex-direction: column;
  }

  .email-msg {
    font-size: 15px;
    line-height: 1.25rem;
  }
</style>
