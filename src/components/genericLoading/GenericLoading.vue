<template>
    <div class="d-flex justify-center align-center loading-container">
      <v-progress-circular
        color="primary"
        indeterminate="disable-shrink"
        size="50"
        width="4"
      />
    </div>
</template>

<script>
  export default {
    name: 'GenericLoading'
  }
</script>

<style scoped>
  .loading-container {
    height: 80%
  }

</style>
