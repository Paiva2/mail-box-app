<template>
  <v-card
    max-width="450"
    class="mail-list-wrapper"
    elevation="2"
    tile
  >
    <template v-slot:subtitle>
      <h1 class="text-h6">{{ pageTitle }}</h1>
    </template>

    <generic-loading v-if="loading" />
    <slot v-else-if="!emailList.length" name="fallback"></slot>

    <v-infinite-scroll
      class="list"
      :class="isLoadingOrEmpty"
      mode="manual"
      @load="loadMore"
      color="blue-darken-1"
    >
      <v-list lines="two" class="list-items pt-0">
        <v-list-item :disabled="loadingEmailList" v-for="(email, index) in emailList" :key="email.id" class="pa-0">
          <v-btn
            selected-class="selected"
            v-ripple="{ class: `text-info` }"
            tile
            class="mail-button w-100 d-flex text-start font-weight-regular"
            :class="email.id === selectedEmailId ? 'selected' : ''"
            height="64"
            elevation="0"
            @click="selectEmailToPreview(email.id)"
          >
            <v-avatar class="mr-3" :image="email.emailOwnerPicture ?? profile.defaultProfilePicture" color="surface-variant" />

            <div class="d-flex btn-content-wrapper">
              <p class="mb-1 text-body-1 email-title">{{ email.subject }}</p>

              <div class="btn-content-texts">
                <span class="text-primary">{{ profile?.name }}</span> &mdash;
                <span>{{ email.message }}</span>
              </div>
            </div>
          </v-btn>

          <v-divider v-if="index < emailList.length - 1"></v-divider>
        </v-list-item>
      </v-list>

      <template v-slot:load-more="{ props }">
        <v-btn
          v-if="this.request.totalPages > 1"
          :disabled="isLastPage"
          variant="outlined"
          v-bind="props"
          color="blue-darken-1"
        >
          Load more
        </v-btn>
      </template>
    </v-infinite-scroll>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'EmailList',
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    request: {
      type: Object,
      required: true
    },
    isLoadingOrEmpty: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['loadingEmailList', 'selectedEmailId', 'emailList', 'profile']),
    isLastPage() {
      return this.request.page === this.request.totalPages
    },
  },
  methods: {
    selectEmailToPreview(emailId) {
      this.$emit("update:selectEmailPreview", emailId)
    },
    loadMore() {
      this.$emit("update:loadMore")
    }
  }
}
</script>

<style scoped>
  .mail-button:deep(.v-btn__content) {
    min-width: 100%;
    justify-content: start;
  }

  .mail-list-wrapper {
    height: calc(100vh - 44px);
    overflow-y: auto;
    min-width: 27.1875rem;
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

  .list.hide {
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    pointer-events: none;
  }

  .email-title {
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
