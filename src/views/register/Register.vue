<template>
  <v-container class="d-flex main-wrapper align-center justify-center">
    <h1 class="title mb-2">Mail Box</h1>

    <v-form @submit.prevent="handleRegister" ref="form" class="d-flex form-wrapper pa-10 elevation-2">
      <div class="form-title d-flex">
        <h2 class="d-flex">
          <v-icon color="blue-darken-3" size="22">mdi-email-outline</v-icon>
          <span class="ml-1">Create an account</span>
        </h2>
        <p>Welcome!</p>
      </div>

      <v-container class="fields-wrapper d-flex pa-0">
        <v-text-field
          hide-details="auto"
          label="Name"
          placeholder="John Doe"
          type="text"
          variant="underlined"
          color="blue-darken-3"
          :rules="nameRules"
          v-model="formFields.name"
          validate-on="submit"
        />

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

        <v-text-field
          hide-details="auto"
          label="Confirm Password"
          :type="showConfirmPassword ? 'text' : 'password'"
          variant="underlined"
          color="blue-darken-3"
          :rules="confirmPasswordRules"
          v-model="formFields.confirmPassword"
          validate-on="submit"
        >
          <template v-slot:append-inner>
            <v-btn
              @click="toggleConfirmPasswordShow"
              size="32"
              class="elevation-0 inner-btn-icon"
              :icon="iconConfirmPassword"
            />
          </template>
        </v-text-field>
      </v-container>

      <p class="link">Already have an account?
        <router-link :to="{ name: 'login'}">
          Sign up!
        </router-link>
      </p>

      <v-btn
        type="submit"
        class="register-btn"
        color="blue-darken-3 mt-8"
        rounded="0"
        :loading="loadingRegister"
        :disabled="loadingRegister"
      >
        Register
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import api from '@/lib/axios'
import { useToast } from "vue-toastification";

  export default {
    name: 'Register',
    setup() {
      const toast = useToast();

      return { toast };
    },
    data() {
      return {
        showPassword: false,
        showConfirmPassword: false,
        loadingRegister: false,
        formFields: {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        },
        emailRules: [
          value => {
            if (/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) return true
            return 'Invalid e-mail.'
          },
        ],
        passwordRules: [
          value => {
            if (value.length > 5) return true
            return 'Password must have at least 6 characters.'
          }
        ],
        confirmPasswordRules: [
          value => {
            if (value === '') return "Password confirmation can't be empty"
            if (value === this.formFields.password) return true
            return 'Password confirmation must match password.'
          }
        ],
        nameRules: [
          value => {
            if(value.length > 3) return true

            return 'Name must have at least 3 characters.'
          }
        ]
      }
    },
    computed: {
      iconPassword() {
        return this.showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
      },
      iconConfirmPassword() {
        return this.showConfirmPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
      }
    },
    methods: {
      async handleRegister() {
        const { valid } = await this.$refs.form.validate()

        if(!valid) return

        this.loadingRegister = true

        try {
          await api.post("/user/register", {
            email: this.formFields.email,
            password: this.formFields.password,
            name: this.formFields.name
          })

          this.resetForm()
          this.toast.success('Registered successfully!');
        } catch(e) {
          console.error(e)
          if (e.response.status === 409) {
            return this.toast.error('E-mail already being used!');
          }

          this.toast.error('Error while registering... Try again.');
        } finally {
          this.loadingRegister = false
        }
      },
      resetForm() {
        this.formFields = {
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        }
      },
      togglePasswordShow() {
        this.showPassword = !this.showPassword
      },
      toggleConfirmPasswordShow() {
        this.showConfirmPassword = !this.showConfirmPassword
      },
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
    min-height: 300px;
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
      font-size: 1.125rem;
      align-items: center
  }

  .form-title p{
      font-size: .8125rem;
  }

  .register-btn {
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
