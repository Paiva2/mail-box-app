<template>
    <v-bottom-sheet
      fullscreen
      v-model="profileMenu.open"
    >
      <v-card class="pa-5 menu-container">
        <div class="d-flex">
          <v-btn
            @click="closeMenu"
            icon="mdi-arrow-left"
            color="blue-darken-3"
            size="40"
          />
        </div>
        <v-form @submit.prevent="" ref="form" class="d-flex form-wrapper pa-10 h-100">

          <div>
            <div class="form-title d-flex">
              <h2 class="d-flex">
                Profile
              </h2>
            </div>

            <div class="fields-wrapper d-flex pa-0">
              <span class="profile-picture">
                <label class="profile-input-label">
                  <input class="profile-input" type="file" />
                  <img :src="formFields.profilePicture" />
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
              />

              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                label="New Password"
                variant="underlined"
                color="blue-darken-3"
                validate-on="submit"
                hint="Use a password with more than 6 characters"
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
            type="submit"
            color="grey-darken-1 mt-8"
            rounded="0"
            @click="closeMenu"
            >
              Cancel
            </v-btn>

            <v-btn
            type="submit"
            color="blue-darken-3 mt-8"
            rounded="0"
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

  export default {
    name: 'ProfileMenu',
    props: {
      profileMenu: {
        type: Object,
        required: true
      }
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
      ...mapState(['profile']),
      iconPassword() {
        return this.showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
      },
      iconConfirmPassword() {
        return this.showConfirmPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
      },
    },
    methods: {
      closeMenu() {
        this.$emit('close-menu')
      },
      fillDefaultValues() {
        this.formFields = {
          name: this.profile.name,
          email: this.profile.email,
          password: '',
          confirmPassword: '',
          profilePicture: this.profile.profilePicture || this.profile.defaultProfilePicture
        }
      },
      toggleShowPassword() {
        this.showPassword = !this.showPassword
      },
      toggleShowConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword
      }
    }
  }
</script>

<style scoped>
  .menu-container {
    background-color: #ECEFF1;
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
