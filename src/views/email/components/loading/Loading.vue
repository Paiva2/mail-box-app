<template>
  <div class="pa-4 text-center w-100 d-flex align-center justify-center">
  <v-list
    class="py-2"
    color="primary"
    elevation="2"
    width="300"
  >
    <v-list-item
      prepend-icon="mdi-email"
      :title="text"
    >
      <template v-slot:prepend>
        <div class="pe-4">
          <v-icon color="primary" size="x-large"></v-icon>
        </div>
      </template>

      <template v-slot:append>
        <v-progress-circular
          color="primary"
          indeterminate="disable-shrink"
          size="16"
          width="2"
        ></v-progress-circular>
      </template>
    </v-list-item>
  </v-list>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      text: {
        type: String,
        default: 'Loading...'
      }
    },
    data() {
      return {
        show: true
      }
    }
  }
</script>

<style scoped>

</style>
