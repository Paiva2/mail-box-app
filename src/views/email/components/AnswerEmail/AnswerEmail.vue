<template>
  <v-bottom-sheet
    fullscreen
    v-model="answerEmailForm.open"
  >
    <v-card class="pa-5 menu-container">
      <div class="d-flex actions-btns">
        <v-btn
          @click="closeMenu"
          icon="mdi-arrow-left"
          color="blue-darken-3"
          size="40"
          :disabled="loading"
        />
      </div>
      <v-form @submit.prevent="handleNewEmail(false)" ref="form" class="d-flex form-wrapper pa-10 pt-5 pb-4">
        <div class="input-area d-flex">
          <div class="form-title d-flex">
            <h2 class="d-flex">
              Answer E-mail
            </h2>
          </div>

          <div class="fields-wrapper d-flex pa-0">
            <span class="d-flex align-center">
              <span class="pb-1 default-label">Title: </span>
              <v-text-field
                variant="underlined"
                validate-on="submit"
                class="ml-3 text-body-1"
                color="blue-darken-3"
                v-model="formFields.title"
                :rules="titleRules"
              />
            </span>

            <span class="d-flex align-center">
              <span class="pb-1 default-label">To: </span>
              <v-combobox
                variant="underlined"
                validate-on="submit"
                class="ml-3 text-body-1"
                color="blue-darken-3"
                multiple
                v-model="formFields.toList"
                :rules="[emailToTest]"
                chips
                readonly
              />
            </span>

            <span class="d-flex align-center">
              <span class="default-label">Cc: </span>
              <v-combobox
                variant="underlined"
                validate-on="submit"
                class="ml-3 text-body-1"
                color="blue-darken-3"
                v-model="formFields.copiesList"
                :rules="[emailCcTest]"
                chips
                multiple
                readonly
              />
            </span>

            <v-file-input
              v-model="formFields.attachments"
              hint="To upload multiple attachments, select all in once"
              variant="underlined"
              color="blue-darken-3"
              :rules="attachmentRules"
              clearable
              multiple
              show-size
              counter
              persistent-hint
            >
              <template v-slot:selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <v-chip
                    class="me-2"
                    color="blue-darken-3"
                    size="small"
                    label
                    close
                  >
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>
            </v-file-input>

            <v-textarea
              label="Message"
              clear-icon="mdi-close-circle"
              base-color="blue-darken-3"
              bg-color="white"
              class="mail-text-area mt-2"
              rows="7"
              validate-on="submit"
              v-model="formFields.message"
              :rules="messageRules"
              counter
              no-resize
              tile
            />
          </div>
        </div>

        <div class="actions-wrapper d-flex w-100 justify-end">
          <v-btn
            type="button"
            color="grey-darken-1 mt-8"
            rounded="0"
            @click="closeMenu"
            :disabled="loading"
          >
            Cancel
          </v-btn>

          <v-btn
            type="submit"
            color="blue-darken-2 mt-8"
            rounded="0"
            append-icon="mdi-send"
            :loading="loading"
          >
            Send answer
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import api from '@/lib/axios'
import { mapState } from 'vuex'
import { useToast } from "vue-toastification";

export default {
  props: {
    answerEmailForm: {
      type: Object,
      required: true
    }
  },
  setup() {
    const toast = useToast();

    return { toast };
  },
  computed: {
    ...mapState(['auth', 'stompClient']),
  },
  data() {
    return {
      loading: false,
      formFields: {
        title: '',
        message: '',
        toList: [],
        copiesList: [],
        attachments: [],
      },
      mailRegex: /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      titleRules: [
        (value) => {
          if (!value) return "Title can't be empty!"
          if (value.length < 3) return "Title must have at least 3 characters!"
          return true
        }
      ],
      attachmentRules: [
        files => !files.some(file => file.size > 5000000) || 'File cannot have more than 5MB!'
      ],
      messageRules: [
        value => !!value || `Message can't be empty`,
        value => value.length <= 1000 || 'Max 1000 characters'
      ]
    }
  },
  methods: {
    closeMenu() {
      this.answerEmailForm.open = false
    },
    async handleNewEmail(draft = false) {
      const { valid } = await this.$refs.form.validate()

      if (!valid) return

      let url = '/email/new'

      if (draft) {
        url += '/draft'
      }

      const body =  {
        toEmails: this.formFields.toList,
        subject: this.formFields.title,
        message: this.formFields.message,
        copyList: this.formFields.copiesList
      }

      this.loading = true

      let attachments = []

      try {
        const emailCreation = await api.post(url, body, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        if (emailCreation.status === 201 && !draft && this.formFields.attachments.length > 0) {
          const formData = new FormData()

          this.formFields.attachments.forEach(attachment => {
            formData.append('attachments', attachment)
          })

          const { data } = await this.insertAttachmentOnEmail(formData, emailCreation.data.id)

          attachments = data
        }

        if (!draft) {
          this.stompClient.send('/app/inbox', {}, JSON.stringify({
            emailPayload: {
              id: emailCreation.data.id,
              hasOrder: emailCreation.data.hasOrder,
              opened: false,
              message: emailCreation.data.message,
              title: emailCreation.data.subject,
              createdAt: emailCreation.data.createdAt,
              from: emailCreation.data.sendFrom,
              fromName: emailCreation.data.sendFromName,
              usersReceiving: this.formFields.toList,
              copies: this.formFields.copiesList,
              fromProfilePicture: emailCreation.data.sendFromProfilePicture,
              attachments
            },
            messageType: 'ANSWER_EMAIL_INBOX'
          }))
        }

        this.toast.success(`Answer sent successfully!`);
        this.resetFieldsStates()
      } catch(err) {
        console.log("Error while answering the e-mail...")
        this.toast.error(err.response.data.message);
      } finally {
        this.loading = false
      }
    },
    async insertAttachmentOnEmail(formData, emailId) {
      return await api.post(`/attachment/insert/email/${emailId}`, formData, {
        headers: {
          Authorization: `Bearer ${this.auth.token}`
        }
      })
    },
    async resetFieldsStates() {
      await this.$refs.form.reset()

      this.formFields = {
        title: '',
        message: '',
        toList: [],
        copiesList: [],
        attachments: [],
      }
    },
    emailToTest(value) {
      if (!value.length) return "List can't be empty!"
      const invalidEmail = value.some(email => !this.mailRegex.test(email))
      if (invalidEmail) return "List can't contain invalid e-mail format!"
      return true
    },
    emailCcTest(value) {
      if (!value.length) return true
      const invalidEmail = value.some(email => !this.mailRegex.test(email))
      if (invalidEmail) return "List can't contain invalid e-mail format!"
      const emailOnToList = value.some(email => this.formFields.toList.includes(email))
      if (emailOnToList) return "Can't add copies that already exists on 'To' list!"
      return true
    }
  }
}
</script>

<style scoped>
  .menu-container {
    background-color: #ECEFF1;
  }

  .form-wrapper {
    flex-direction: column;
    justify-content: space-between;
  }

  .fields-wrapper {
    flex-direction: column;
    gap: .9375rem;
  }

  .actions-wrapper {
    gap: 1.25rem;
  }

  .actions-wrapper button {
    min-width: 8.125rem;
  }

  .input-area {
    flex-direction: column;
    gap: .9375rem;
  }

  .default-label {
    width: 2.25rem;
  }
</style>
