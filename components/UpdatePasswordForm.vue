<script setup lang="ts">
import JetActionMessage from './ActionMessage.vue'
import JetButton from './Button.vue'
import JetFormSection from './FormSection.vue'
import JetInput from './Input.vue'
import JetLabel from './Label.vue'
import api from '../api'
import { ref } from 'vue'

const form = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const recentlySuccessful = ref(false)
const processing = ref(false)

const password = ref<HTMLInputElement | null>(null)

function updatePassword() {
  processing.value = true

  api
    .put('/user/password', form.value)
    .then(() => {
      form.value.password = ''
      form.value.password_confirmation = ''
      recentlySuccessful.value = true

      setTimeout(() => (recentlySuccessful.value = false), 3000)
    })
    .catch(() => {
      password.value?.focus()
    })
    .finally(() => (processing.value = false))
}
</script>

<template>
  <jet-form-section @submitted="updatePassword">
    <template #title> Update password </template>

    <template #description> Ensure your account is using a long, random password to stay secure. </template>

    <template #form>
      <div class="col-span-6 sm:col-span-4">
        <jet-label for="current_password" value="Current password" />
        <jet-input
          id="current_password"
          type="password"
          class="mt-1 block w-full"
          v-model="form.current_password"
          ref="current_password"
          autocomplete="current-password"
          required
        />
      </div>

      <div class="col-span-6 sm:col-span-4">
        <jet-label for="password" value="New password" />
        <jet-input
          id="password"
          type="password"
          class="mt-1 block w-full"
          v-model="form.password"
          ref="password"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="col-span-6 sm:col-span-4">
        <jet-label for="password_confirmation" value="Confirm new password" />
        <jet-input
          id="password_confirmation"
          type="password"
          class="mt-1 block w-full"
          v-model="form.password_confirmation"
          autocomplete="new-password"
          required
        />
      </div>
    </template>

    <template #actions>
      <jet-action-message :on="recentlySuccessful" class="mr-3"> Saved. </jet-action-message>

      <jet-button :class="{ 'opacity-25': processing }" :disabled="processing"> Save </jet-button>
    </template>
  </jet-form-section>
</template>
