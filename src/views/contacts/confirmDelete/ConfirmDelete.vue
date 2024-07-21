<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
    persistent
  >
    <v-card
      title="Delete this contact permanently?"
      class="text-center pa-3"
      elevation="5"
    >
    <template v-slot:prepend>
      <v-icon color="red-darken-4" size="33">mdi-delete-alert</v-icon>
    </template>

    <template v-slot:text>
      <p class="text-body-1">Contact: <strong>{{ contact?.name }}</strong></p>
    </template>

    <template v-slot:actions>
      <v-spacer></v-spacer>

      <v-btn
        text="Close"
        @click="close"
        :disabled="loading"
      />

      <v-btn
        variant="tonal"
        text="Delete"
        color="red-darken-4"
        :loading="loading"
        @click="confirmDelete"
      />
    </template>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/lib/axios'
import { useToast } from "vue-toastification";
import { mapState } from 'vuex'

export default {
  name: 'ConfirmDelete',
  setup() {
    const toast = useToast();

    return { toast };
  },
  props: {
    openConfirmDeleteDialog: {
      type: Boolean,
      required: true,
      default: false
    },
    contact: {
      type: [null, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState(['auth']),
    showDialog() {
      return this.openConfirmDeleteDialog;
    }
  },
  methods: {
    close() {
      this.$emit('update:close')
    },
    async confirmDelete() {
      this.loading = true

      try {
        await api.delete(`/contact/${this.contact.id}`, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        this.toast.success('Contact deleted!');
        this.$emit('update:list')
        this.close()
      } catch {
        console.error("Error deleting contact... Try again.")
        this.toast.error('Error deleting contact!');
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
