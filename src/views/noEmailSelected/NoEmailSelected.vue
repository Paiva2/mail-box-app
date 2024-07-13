<template>
  <div class="fallback-wrapper text-center">
    <p class="font-weight-regular text-grey-darken-3">Select an e-mail to preview</p>
    <v-icon color="blue-grey-lighten-4" size="80">mdi-email-open-outline</v-icon>
    <p class="font-weight-light text-grey-darken-2">No e-mail selected</p>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  .fallback-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    flex-direction: column;
    gap: .9375rem;
    background-color: transparent;
  }

  .fallback-wrapper p {
    font-size: 1rem;
  }
</style>
