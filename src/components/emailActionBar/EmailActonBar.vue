<template>
  <v-app-bar :elevation="1" height="43">
    <div class="d-flex actions-wrapper">
      <div class="actions d-flex">
        <v-btn tile>
          <v-icon color="blue-darken-1" class="mr-1">
            mdi-email
          </v-icon>
          New e-mail
        </v-btn>

        <v-btn tile>
          <v-icon color="yellow-darken-4" class="mr-1">
            mdi-archive
          </v-icon>
          Archive
        </v-btn>

        <v-btn tile>
          <v-icon color="red-darken-2" class="mr-1">
            mdi-delete
          </v-icon>
          Delete
        </v-btn>
      </div>

      <div class="d-flex search">
        <v-text-field
          v-if="false"
          density="compact"
          variant="underlined"
          hide-details
          color="blue-darken-1"
          label="Search e-mails"
          single-line=""
        />
        <v-btn class="search-trigger" tile icon="mdi-magnify" />
      </div>
    </div>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'EmailActionBar'
  }
</script>

<style scoped>
  .actions-wrapper {
    width: 100%;
    height: 100%;
    justify-content: space-between
  }

  .actions-wrapper button {
    text-transform: none;
    font-weight: 400;
    height: 100%;
  }

  .actions {
    align-items: center;
  }

  .search {
    flex: 1;
    gap: .3125rem;
    max-width: 35%;
    justify-content: flex-end;
  }
</style>
