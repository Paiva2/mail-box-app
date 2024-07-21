<template>
  <v-dialog
    max-width="600"
    persistent
    v-model="showDialog"
  >
    <v-card
      prepend-icon="mdi-contacts"
      :title="formTitle"
      class="elevation-5 pa-2"
    >
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12" sm="6">
              <v-text-field
                label="Name*"
                required
                color="blue-darken-1"
                validate-on="submit"
                v-model="formFields.name"
                :rules="nameRules"
                class="pb-3"
                :loading="loading"
              />
            </v-col>

            <v-col cols="12" md="12" sm="6">
              <v-text-field
                label="Email*"
                required
                color="blue-darken-1"
                validate-on="submit"
                v-model="formFields.email"
                :rules="emailRules"
                class="pb-3"
                :loading="loading"
              />
            </v-col>

          </v-row>

          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            @click="close"
            :disabled="loading"
          />

          <v-btn
            color="blue-darken-1"
            :text="actionButtonText"
            variant="tonal"
            type="submit"
            :loading="loading"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/lib/axios'
import { useToast } from "vue-toastification";
import { mapState } from 'vuex'

export default {
  name: 'ContactForm',
  setup() {
    const toast = useToast();

    return { toast };
  },
  props: {
    openForm: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    formFields: {
      type: [Object],
      required: true
    },
    contactEditing: {
      type: [Object, null],
      required: true
    },
  },
  data() {
    return {
      loading: false,
      nameRules: [
        value => !!value || "Contact name can't be empty."
      ],
      emailRules: [
        value => {
          if (/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) return true
          return 'Invalid e-mail.'
        },
      ],
    }
  },
  computed: {
    ...mapState(['auth']),
    showDialog() {
      return this.openForm;
    },
    formTitle() {
      return this.editing ? "Edit contact" : "Create contact"
    },
    actionButtonText() {
      return this.editing ? "Edit" : "Create"
    }
  },
  methods: {
    async handleSubmit() {
      const { valid } = await this.$refs.form.validate()

      if (!valid) return

      this.loading = true

      const body = {
        name: this.formFields.name,
        email: this.formFields.email
      }

      if (!this.editing) {
        await this.createContact(body)
      } else {
        await this.editContact(body)
      }
    },
    async createContact(body) {
      try {
        await api.post('/contact/new', body, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        this.toast.success('Contact added!');
        this.$emit('update:list')
        this.close()
      } catch {
        console.error("Error adding contact... Try again.")
        this.toast.error('Error adding contact!');
      } finally {
        this.loading = false
      }
    },
    async editContact(body) {
      const hasValuesChanged = this.checkValuesChanged(body)

      try {
        if (hasValuesChanged) {
          await api.patch(`/contact/${this.contactEditing.id}`, body, {
            headers: {
              Authorization: `Bearer ${this.auth.token}`
            }
          })

          this.$emit('update:list')
        }

        this.toast.success('Contact edited!');
        this.close()
      } catch {
        console.error("Error editing contact... Try again.")
        this.toast.error('Error editing contact!');
      } finally {
        this.loading = false
      }
    },
    checkValuesChanged(newValues) {
      return newValues.name !== this.contactEditing.name || newValues.email !== this.contactEditing.email
    },
    close() {
      this.$emit("update:close")
    }
  }
}
</script>
