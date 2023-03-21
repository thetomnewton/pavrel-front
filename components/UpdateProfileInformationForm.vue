<script>
import JetButton from './Button.vue'
import JetFormSection from './FormSection.vue'
import JetInput from './Input.vue'
import JetLabel from './Label.vue'
import JetActionMessage from './ActionMessage.vue'
import JetSecondaryButton from './SecondaryButton.vue'
import api from '../api'
import { mapState } from 'vuex'
import { CheckIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
    CheckIcon,
    JetActionMessage,
    JetButton,
    JetFormSection,
    JetInput,
    JetLabel,
    JetSecondaryButton,
  },

  data() {
    return {
      form: {
        name: '',
        email: '',
        photo: null,
      },

      photoPreview: null,
    }
  },

  computed: {
    ...mapState('base', ['user']),
  },

  watch: {
    user: {
      immediate: true,
      handler(user) {
        if (!this.form.name) this.form.name = user.name
        if (!this.form.email) this.form.email = user.email
      },
    },
  },

  methods: {
    updateProfileInformation() {
      if (this.$refs.photo) {
        this.form.photo = this.photoPreview
      }

      api.put('/user/profile-information', this.form).then(({ data }) => {
        this.clearPhotoFileInput()

        this.form.recentlySuccessful = true

        setTimeout(() => {
          this.form.recentlySuccessful = false
        }, 4000)

        this.$store.commit('base/setUser', data)
      })
    },

    selectNewPhoto() {
      this.$refs.photo.click()
    },

    updatePhotoPreview() {
      const photo = this.$refs.photo.files[0]

      if (!photo) return

      const reader = new FileReader()

      reader.onload = e => {
        this.photoPreview = e.target.result
      }

      reader.readAsDataURL(photo)
    },

    deletePhoto() {
      api.delete('/user/profile-photo').then(() => {
        this.photoPreview = null
        this.clearPhotoFileInput()

        this.form.recentlySuccessful = true

        setTimeout(() => {
          this.form.recentlySuccessful = false
        }, 4000)

        const user = this.user
        user.profile_photo_path = null

        const initials = user.name
          .split(' ')
          .map(word => word[0].toUpperCase())
          .join('+')

        user.profile_photo_url = `https://ui-avatars.com/api/?name=${initials}&color=7F9CF5&background=EBF4FF`
        this.$store.commit('base/setUser', user)
      })
    },

    clearPhotoFileInput() {
      if (this.$refs.photo?.value) {
        this.$refs.photo.value = null
      }
    },
  },
}
</script>

<template>
  <jet-form-section @submitted="updateProfileInformation">
    <template #title> Basic details </template>

    <template #description> Update your account's profile information and email address. </template>

    <template #form>
      <!-- Profile Photo -->
      <div class="col-span-6 sm:col-span-4">
        <!-- Profile Photo File Input -->
        <input type="file" class="hidden" ref="photo" @change="updatePhotoPreview" />

        <JetLabel for="photo" value="Photo" />

        <!-- Current Profile Photo -->
        <div class="mt-2" v-show="!photoPreview">
          <img :src="user.profile_photo_url" :alt="user.name" class="h-20 w-20 rounded-full object-cover" />
        </div>

        <!-- New Profile Photo Preview -->
        <div class="mt-2" v-show="photoPreview">
          <span
            class="block h-20 w-20 rounded-full"
            :style="
              'background-size: cover; background-repeat: no-repeat; background-position: center center; background-image: url(\'' +
              photoPreview +
              '\');'
            "
          >
          </span>
        </div>

        <JetSecondaryButton class="mt-2 mr-2" type="button" @click.prevent="selectNewPhoto">
          Select new photo
        </JetSecondaryButton>

        <JetSecondaryButton type="button" class="mt-2" @click.prevent="deletePhoto" v-if="user.profile_photo_path">
          Remove photo
        </JetSecondaryButton>
      </div>

      <!-- Name -->
      <div class="col-span-6 sm:col-span-4">
        <JetLabel for="name" value="Name" />
        <jet-input id="name" type="text" class="mt-1 block w-full" v-model="form.name" autocomplete="name" />
      </div>

      <!-- Email -->
      <div class="col-span-6 sm:col-span-4">
        <JetLabel for="email" value="Email" />
        <jet-input id="email" type="email" class="mt-1 block w-full" v-model="form.email" />
      </div>
    </template>

    <template #actions>
      <div class="flex items-center">
        <jet-button :class="{ 'opacity-25': form.processing }" :disabled="form.processing"> Save </jet-button>
        <jet-action-message :on="form.recentlySuccessful || false" class="ml-4">
          <div class="flex items-center">
            <CheckIcon class="mr-1 h-5 w-5 text-green-600" />
            <span>Saved</span>
          </div>
        </jet-action-message>
      </div>
    </template>
  </jet-form-section>
</template>
