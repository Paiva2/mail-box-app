<template>
    <v-bottom-sheet
      fullscreen
      v-model="profileMenu.open"
    >
      <v-card class="pa-5 menu-container">
        <div class="d-flex actions-btns">
          <v-btn
            @click="closeMenu"
            icon="mdi-arrow-left"
            color="blue-darken-3"
            size="40"
            :disabled="loadingUpdate"
          />

          <v-btn
            class="logout"
            @click="logout"
            color="red-darken-4"
            :disabled="loadingUpdate"
          >
            Logout
            <v-icon class="ml-2">mdi-logout</v-icon>
          </v-btn>
        </div>
        <v-form @submit.prevent="handleUpdate" ref="form" class="d-flex form-wrapper pa-10 h-100">
          <div>
            <div class="form-title d-flex">
              <h2 class="d-flex">
                Profile
              </h2>
            </div>

            <div class="fields-wrapper d-flex pa-0">
              <span class="profile-picture">
                <label class="profile-input-label">
                  <input @change="changeProfilePicture" class="profile-input" type="file" />
                  <img :src="handleProfilePictureToShow" />
                  <div class="profile-icon"></div>
                </label>
              </span>

              <v-text-field
                hide-details="auto"
                label="Username"
                type="text"
                variant="underlined"
                color="blue-darken-3"
                readonly
                v-model="formFields.name"
                hint="Username is not updatable"
                persistent-hint
              />

              <v-text-field
                hide-details="auto"
                label="E-mail address"
                placeholder="youremail@email.com"
                type="email"
                variant="underlined"
                color="blue-darken-3"
                validate-on="submit"
                v-model="formFields.email"
                :rules="emailRules"
              />

              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                label="New Password"
                variant="underlined"
                color="blue-darken-3"
                validate-on="submit"
                hint="Use a password with more than 6 characters"
                :rules="passwordRules"
                v-model="formFields.password"
              >
                <template v-slot:append-inner>
                  <v-btn
                    size="32"
                    class="elevation-0 inner-btn-icon"
                    :icon="iconPassword"
                    @click="toggleShowPassword"
                  />
                </template>
              </v-text-field>

              <v-text-field
                hide-details="auto"
                label="Confirm new Password"
                variant="underlined"
                color="blue-darken-3"
                validate-on="submit"
                :type="showConfirmPassword ? 'text' : 'password'"
                hint="Must match the password above"
                :rules="confirmPasswordRules"
                v-model="formFields.confirmPassword"
              >
                <template v-slot:append-inner>
                  <v-btn
                    size="32"
                    class="elevation-0 inner-btn-icon"
                    :icon="iconConfirmPassword"
                    @click="toggleShowConfirmPassword"
                  />
                </template>
              </v-text-field>
            </div>
          </div>

          <div class="actions-wrapper d-flex w-100 justify-end">
            <v-btn
              color="grey-darken-1 mt-8"
              rounded="0"
              @click="closeMenu"
              :disabled="loadingUpdate"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="blue-darken-3 mt-8"
              rounded="0"
              :disabled="loadingUpdate"
            >
              Save
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-bottom-sheet>
</template>

<script>
import { mapState } from 'vuex'
import { MutationTypes } from '@/lib/vuex/types/mutation-types'
import { ActionTypes } from '@/lib/vuex/types/action-types'
import api from '@/lib/axios'
import { useToast } from "vue-toastification";
import { AxiosError } from 'axios'

export default {
  name: 'ProfileMenu',
  props: {
    profileMenu: {
      type: Object,
      required: true
    }
  },
  setup() {
    const toast = useToast();

    return { toast };
  },
  data() {
    return {
      formFields: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      loadingUpdate: false,
      emailRules: [
        (value) => {
          const emailRegex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (emailRegex.test(value)) return true
          return 'Invalid e-mail.'
        },
      ],
      passwordRules: [
        (value) => {
          if (value === '') return true
          if (value !== '' && value?.length > 5) return true
          return 'Password must have at least 6 characters.'
        }
      ],
      confirmPasswordRules: [
          (value) => {
          if (this.formFields.password === '') return true
          if (value === '') return "Password confirmation can't be empty"
          if (value === this.formFields.password) return true
          return 'Password confirmation must match password.'
        }
      ],
    }
  },
  mounted() {
    this.fillDefaultValues()
  },
  watch: {
    'profile': function () {
      this.fillDefaultValues()
    }
  },
  computed: {
    ...mapState(['profile', 'auth']),
    iconPassword() {
      return this.showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
    },
    iconConfirmPassword() {
      return this.showConfirmPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
    },
    handleProfilePictureToShow() {
      if (!this.formFields.profilePicture) {
        return this.profile.profilePicture || this.profile.defaultProfilePicture
      }

      return URL.createObjectURL(this.formFields.profilePicture)
    },
  },
  methods: {
    async handleUpdate() {
      const { valid } = await this.$refs.form.validate()

      if (!valid) return

      this.loadingUpdate = true
      this.toast.clear()

      try {
        const body = await this.handleBodyDefaults()

        if (!body.password && !body.email && !body.profilePicture) return

        await api.patch('/user/update', body, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        })

        this.refreshProfile()
        this.toast.success('Updated successfully!');
      } catch (e) {
        console.error(e)

        if(e instanceof AxiosError) {
          console.error(e)

          if (e.response.status === 409) {
            return this.toast.error('E-mail already being used!');
          }
        }

        this.toast.error('Error while updating... Try again.');
      } finally {
        this.loadingUpdate = false
      }
    },
    closeMenu() {
      this.$emit('close-menu')
    },
    logout() {
      this.$store.commit(MutationTypes.LOGIN.SET_LOGOUT)
      this.$router.push({ name: 'login' })
    },
    fillDefaultValues() {
      this.formFields = {
        ...this.formFields,
        name: this.profile.name,
        email: this.profile.email,
      }
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    changeProfilePicture(event) {
      //this.formFields.profilePicture = event?.target?.files[0];
    },
    async handleBodyDefaults() {
      const body = {}

      if (this.formFields.email !== this.profile.email) {
        body.email = this.formFields.email
      }

      if (this.formFields.password !== '') {
        body.password = this.formFields.password
      }

      // TODO
      if (this.formFields.profilePicture !== '') {
        const multipartFile = new FormData();

        multipartFile.append("file", this.formFields.profilePicture);

        const uploadImage = await api.post("/user/picture", multipartFile, {
          headers: {
            Authorization: `Bearer ${this.auth.token}`
          }
        });

        body.profilePicture = uploadImage.data.url;
      }

      return body
    },
    refreshProfile() {
      this.$store.dispatch(ActionTypes.SET_PROFILE)
    }
  }
}
</script>

<style scoped>
  .menu-container {
    background-color: #ECEFF1;
  }

  .actions-btns {
    justify-content: space-between;
    align-items: center;
  }

  .actions-btns .logout {
    width: fit-content;
  }

  .form-wrapper {
    justify-content: space-between;
    width: 100%;
    flex-direction:  column;
    gap: 1.25rem;
    overflow-y: auto;
  }

  .profile-picture {
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 100%;
    width: 100%;
    height: 150px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }

  .profile-picture .profile-input {
    display: none;
  }

  .profile-input-label {
    position: relative;
    width: 9.375rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 100%;
    overflow: hidden;
  }

  .profile-icon {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    transition: background-color 0.2s ease-in-out;
  }

  .profile-icon:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .profile-input-label img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fields-wrapper {
    flex-direction: column;
    gap: 1.125rem;
  }

  .form-title {
    flex-direction:  column;
  }

  .form-title h2 {
    color: #263238;
    font-size: 1.875rem;
  }

  .actions-wrapper {
    gap: 1.25rem;
  }

  .actions-wrapper button {
    width: 7.5rem;
  }

  .inner-btn-icon {
    background-color: #ECEFF1;
    position: absolute;
    top: 12px;
    right: 0px;
    color: #263238;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
