<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn
        color="blue-darken-1"
        v-bind="props"
        icon="mdi-paperclip"
        size="35"
        variant="outlined"
      />
    </template>

    <v-list class="elevation-1 pa-0" :activatable="false" :selectable="false">
      <v-list-item
        v-for="(attachment) in attachments"
        :key="attachment.id"
        :value="attachment.url"
        :active="false"
        class="px-2"
      >
      <v-list-item-title class="text-body-2 align-center d-flex attachment-item">
        <div class="d-flex align-center">
          <v-icon size="28" class="mr-3" :color="getFileExtensionIcon(attachment).color">
          {{ getFileExtensionIcon(attachment).icon }}
          </v-icon>

          <p class="file-name">{{ attachment.fileName }}</p>
        </div>

        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              icon="mdi-menu-down"
              size="28"
              color="grey-darken-2"
            />
          </template>
          <v-list width="120" class="pa-0">
            <v-list-item
              v-for="(item) in attachmentMenu"
              :key="item.title"
              class="pa-0 list-item-attachment-options"
            >
              <v-btn :disabled="item.title === 'View'" :loading="loadingDownload" @click="item.fn(attachment)" tile slim flat width="100%" height="100%" :prepend-icon="item.icon">
                <v-list-item-title type="button" class="text-body-2 attachment-actions-title">
                  {{ item.title }}
                </v-list-item-title>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import fileIcons from '@/constants/mapFileIcon'
import { useToast } from "vue-toastification"
import api from '@/lib/axios'
import { mapState } from 'vuex'

export default {
  name: 'AttachmentsMenu',
  setup() {
    const toast = useToast();

    return { toast };
  },
  props: {
    attachments: {
      type: Array
    }
  },
  computed: {
    ...mapState(['auth']),
  },
  data() {
    return {
        attachmentMenu: [
        { title: 'Download', icon: 'mdi-download', fn: this.downloadAttachment },
      ],
      loadingDownload: false
    }
  },
  methods: {
    getFileExtensionIcon(attachment) {
      let extension = attachment.extension.toLowerCase()

      switch(extension) {
        case (extension !== 'pdf'):
        case (extension !== 'png'):
        case (extension !== 'jpg'):
        case (extension !== 'jpeg'):
        case (extension !== 'csv'):
        case (extension !== 'xlsx'):
        case (extension !== 'xls'):
        case (extension !== 'txt'):
          extension = 'unknown'
          break
      }

      return fileIcons[extension]
    },
    base64ToUint8Array(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes;
    },
    async downloadAttachment(attachment) {
      const attachmentId = attachment.id
      const emailId = this.$route.params.emailId

      this.loadingDownload = true

      try {
        const download = await api.get(`/attachment/${attachmentId}/email/${emailId}`, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        const byteArray = this.base64ToUint8Array(download.data.fileContentBytes);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const a = window.document.createElement('a');
        a.href = url;
        a.download = download.data.originalFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch(e) {
        console.log("Error while downloading file...")
        this.toast.error('Error while downloading file...');
      }  finally {
        this.loadingDownload = false
      }
    },
  }
}
</script>

<style scoped>
  .attachment-item {
    gap: 1rem;
    max-width: 14.6875rem;
  }

  .file-name {
    width: 7.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .attachment-actions-title {
    width: 4.375rem;
  }

  .list-item-attachment-options:deep(.v-list-item__content) {
    height: 100%;
  }

</style>
