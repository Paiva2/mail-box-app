<template>
  <div class="preview-wrapper text-center">
    <email-fallback />
  </div>
</template>

<script>
import EmailFallback from '../emailFallback/EmailFallback'

export default {
  name: 'EmailPreview',
  components: {
    EmailFallback
  }
}
</script>

<style scoped>
  .preview-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
