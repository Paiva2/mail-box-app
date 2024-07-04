<template>
  <v-container class="d-flex main-wrapper align-center justify-center">
    <h1 class="title mb-2">Mail Box</h1>

    <v-form @submit.prevent="handleLogin" ref="form" class="d-flex form-wrapper pa-10 elevation-2">
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
          :rules="emailRules"
          v-model="formFields.email"
          validate-on="submit"
        />

        <v-text-field
          hide-details="auto"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          variant="underlined"
          color="blue-darken-3"
          :rules="passwordRules"
          v-model="formFields.password"
          validate-on="submit"
        >
          <template v-slot:append-inner>
            <v-btn
              @click="togglePasswordShow"
              size="32"
              class="elevation-0 inner-btn-icon"
              :icon="iconPassword"
            />
          </template>
        </v-text-field>
      </v-container>

      <p class="link">Don't have an account?
        <router-link :to="{ name: 'register'}">
          Register here!
        </router-link>
      </p>

      <v-btn
        type="submit"
        class="login-btn"
        color="blue-darken-3 mt-8"
        rounded="0"
        :loading="loadingLogin"
        :disabled="loadingLogin"
      >
        Login
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import api from "../../lib/axios"
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";

  export default {
    name: 'Login',
    setup() {
      const toast = useToast();

      return { toast };
    },
    data() {
      return {
        showPassword: false,
        loadingLogin: false,
        formFields: {
          email: '',
          password: ''
        },
        emailRules: [
          value => {
            if (/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) return true
            return 'Invalid e-mail.'
          },
        ],
        passwordRules: [
          value => {
            if(value.length > 5) return true

            return 'Password must have at least 6 characters.'
          }
        ]
      }
    },
    computed: {
      iconPassword() {
        return this.showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
      }
    },
    methods: {
      async handleLogin() {
        const { valid } = await this.$refs.form.validate()

          if(!valid) return

          this.loadingLogin = true

         try {
          const doLogin = await api.post("/user/login", {
            email: this.formFields.email,
            password: this.formFields.password
          })

          const authToken = doLogin.data.authToken

          this.$refs.form.reset()
        } catch(e) {
          console.error("Error on login... Try again.")
          this.toast.error(e.response.data.message);
        } finally {
          this.loadingLogin = false
        }
      },
      resetForm() {
        this.formFields = {
          email: '',
          password: ''
        }
      },
      togglePasswordShow() {
        this.showPassword = !this.showPassword
      }
    },
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

  .inner-btn-icon {
    position: absolute !important;
    top: 12px;
    right: 0px;
    color: #263238;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
