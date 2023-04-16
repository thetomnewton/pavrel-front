<script>
import FormSection from './FormSection.vue'
import Button from './Button.vue'
import Input from './Input.vue'
import Label from './Label.vue'
import ActionMessage from './ActionMessage.vue'
import SecondaryButton from './SecondaryButton.vue'
import api from '../api'
import { mapMutations, mapState } from 'vuex'
import { CheckIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
    CheckIcon,
    ActionMessage,
    Input,
    Label,
    SecondaryButton,
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
    ...mapMutations('base', ['showToast']),

    updateProfileInformation() {
      if (this.$refs.photo) {
        this.form.photo = this.photoPreview
      }

      api.put('/user/profile-information', this.form).then(({ data }) => {
        this.clearPhotoFileInput()

        this.showToast({ type: 'profile-update', data: {} })

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

        this.showToast({ type: 'profile-update', data: {} })

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
  <FormSection @submitted="updateProfileInformation">
    <template #title> Basic details </template>

    <template #description> Update your account's profile information and email address. </template>

    <template #form>
      <!-- Profile Photo -->
      <div class="col-span-6 sm:col-span-4">
        <!-- Profile Photo File Input -->
        <input type="file" class="hidden" ref="photo" @change="updatePhotoPreview" />

        <Label for="photo" value="Photo" />

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

        <SecondaryButton class="mt-2 mr-2" type="button" @click.prevent="selectNewPhoto">
          Select new photo
        </SecondaryButton>

        <SecondaryButton type="button" class="mt-2" @click.prevent="deletePhoto" v-if="user.profile_photo_path">
          Remove photo
        </SecondaryButton>
      </div>

      <!-- Name -->
      <div class="col-span-6 sm:col-span-4">
        <Label for="name" value="Name" />
        <Input id="name" type="text" class="mt-1 block w-full" v-model="form.name" autocomplete="name" />
      </div>

      <!-- Email -->
      <div class="col-span-6 sm:col-span-4">
        <Label for="email" value="Email" />
        <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" />
      </div>
    </template>

    <template #actions>
      <div class="flex items-center">
        <Button :class="{ 'opacity-25': form.processing }" :disabled="form.processing"> Save </Button>
      </div>
    </template>
  </FormSection>
</template>
