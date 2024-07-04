<template>
  <v-container class="d-flex main-wrapper align-center justify-center">
    <h1 class="title mb-2">Mail Box</h1>

    <form class="d-flex form-wrapper pa-10 elevation-2">
      <div class="form-title d-flex">
        <h2 class="d-flex">
          <v-icon color="blue-darken-3" size="31">mdi-email-outline</v-icon>
          <span class="ml-1">Mail Box</span>
        </h2>
        <p>Login on your account</p>
      </div>

      <v-container class="fields-wrapper d-flex pa-0">
        <v-text-field
          hide-details="auto"
          label="E-mail address"
          placeholder="youremail@email.com"
          type="email"
          variant="underlined"
          color="blue-darken-3"
        />

        <v-text-field
          hide-details="auto"
          label="Password"
          type="password"
          variant="underlined"
          color="blue-darken-3"
        />
      </v-container>

      <p class="link">Don't have an account? <a href="#">Register here!</a></p>

      <v-btn
        type="submit"
        class="login-btn"
        color="blue-darken-3 mt-8"
        rounded="0"
      >
        Login
      </v-btn>
    </form>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .main-wrapper {
    flex-direction:  column;
    min-height: 100vh;
  }

  .title {
    color: #263238;
    font-size: 2.25rem;
  }

  .form-wrapper {
    background-color: #fff;
    width: 100%;
    max-width: 28.125rem;
    min-height: 21.25rem;
    flex-direction:  column;
    gap: 1.25rem;
  }

  .fields-wrapper {
    flex-direction: column;
    gap: 1.125rem;
  }

  .link {
    color: #263238;
    font-size: .875rem;
  }

  .link a {
    color: #1565C0;
    text-decoration: none;
    font-weight: 600;
  }

  .link a:hover {
    text-decoration: underline;
  }

  .form-title {
      flex-direction:  column;
      color: #263238;
  }

  .form-title h2{
      font-size: 1.625rem;
      align-items: center
  }

  .form-title p{
      font-size: .875rem;
  }

  .login-btn {
    width: 7.5rem;
    align-self: end
  }

</style>
