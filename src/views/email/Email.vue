<template>
  <loading text="Loading e-mail..." v-if="loading" />

    <div class="email-view-wrapper d-flex pa-2" v-else-if="!!email.id">
      <div class="email-title pa-1">
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
                  :image="email.sendFromProfilePicture ?? profile.defaultProfilePicture"
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

                  <template v-for="(receiving) in email.usersReceiving?.join(', ')" :key="receiving">
                    {{ receiving }}
                  </template>
                </span>

                <span v-if="!!email.copies?.length" class="text-body-2 text-grey-darken-1 font-weight-regular to-list">
                  <span class="text-grey-darken-1">Copies: </span>
                  <template v-for="(receiving) in email.copies.join(', ')" :key="receiving">
                    {{ receiving }}
                  </template>
                </span>

                <span class="text-body-2 text-grey-darken-1 font-weight-regular to-list">
                  <span class="text-grey-darken-1">Send at: </span>
                    {{ formatDate(email.createdAt) }}
                </span>
              </div>
            </div>

            <div class="d-flex align-center email-actions">
              <v-tooltip text="Answer" location="top" v-if="!hideAnswer">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    flat
                    icon="mdi-arrow-left-bottom"
                    size="35"
                    variant="outlined"
                    color="light-green-darken-2"
                    @click="handleAnswerForm"
                  />
                </template>
              </v-tooltip>
              <attachments-menu v-if="!!email.attachments?.length" :attachments="email.attachments" />
            </div>
          </div>

          <v-divider inset />

          <div class="message-box pa-5 pt-2">
            <p class="email-msg">
              {{ email.message }}
            </p>
          </div>
        </div>
      </div>

      <answer-email v-if="!hideAnswer" :answerEmailForm="answerEmailForm" />
    </div>

    <v-empty-state
      v-else
      headline="Whoops, 404"
      title="E-mail not found"
      text="The e-mail you were looking for does not exist"
      icon="mdi-email-off"
      class="w-100"
    />
</template>

<script>
import api from '@/lib/axios'
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import AttachmentsMenu from './components/attachmentsMenu/AttachmentsMenu'
import Loading from './components/loading/Loading'
import fileIcons from '@/constants/mapFileIcon'
import AnswerEmail from './components/AnswerEmail/AnswerEmail'

export default {
  components: {
    Loading,
    AttachmentsMenu,
    AnswerEmail
  },
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
      loading: false,
      answerEmailForm: {
        open: false
      }
    }
  },
  computed: {
    ...mapState(['auth', 'profile']),
    isFilteringSentOrDraft() {
      return this.$route.name === 'emailSent' || this.$route.name === 'emailDraft'
    },
    hideAnswer() {
      return this.isFilteringSentOrDraft || this.$route.name === 'emailTrash'
    }
  },
  async created() {
    await this.fetchEmail(this.$route.params.emailId)
    this.$store.commit(MutationTypes.EMAIL.SELECTED_ID, this.$route.params.emailId)

    this.$watch(
      () => this.$route.params.emailId,
      async (newId) => {
        this.email = {}
        await this.fetchEmail(newId);
      }
    )
  },
  methods: {
    async fetchEmail(id) {
      this.$store.commit(MutationTypes.SET_LOADING_EMAIL_LIST, true)
      this.loading = true

      let url = null

      if (this.isFilteringSentOrDraft) {
        url = '/email/sent'
      } else {
        url = '/email/me'
      }

      try {
        const email = await api.get(`${url}/${id}`, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        this.email = {
          id: email.data.id,
          hasOrder: email.data.hasOrder,
          opened: email.data.opened ?? null,
          message: email.data.message,
          title: email.data.subject,
          createdAt: email.data.createdAt,
          from: this.isFilteringSentOrDraft ? 'Me' : email.data.sendFrom,
          fromName: this.isFilteringSentOrDraft ? 'Me' : email.data.sendFromName,
          usersReceiving: this.formatReceivingList(email.data.usersReceivingEmailOutput),
          isSpam: email.data.isSpam ?? null,
          attachments: email.data.attachments,
          copies: this.formatReceivingList(email.data.ccs),
          sendFromProfilePicture: this.isFilteringSentOrDraft ? this.profile.profilePicture : email.data.sendFromProfilePicture
        }

        this.$store.commit(MutationTypes.EMAIL.SELECTED_EMAIL, this.email)
      } catch (e){
        console.error(e)
        console.log("Error while fetching e-mail...")
      } finally {
        this.$store.commit(MutationTypes.SET_LOADING_EMAIL_LIST, false)
        this.loading = false
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
    },
    formatDate(date) {
      return new Date(date)?.toLocaleDateString('en-US', {
        minute: "2-digit",
        hour: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    },
    handleAnswerForm() {
      if(this.hideAnswer) return

      this.answerEmailForm.open = true
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

  .message-box {
    word-break: break-word;
    word-wrap: break-word;
  }

  .email-actions {
    gap: .625rem
  }
</style>
