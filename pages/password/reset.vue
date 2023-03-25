<script setup lang="ts">
import api from '../../api'
import { ref } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Reset your password',
})

const props = defineProps<{
  email: string
  token: string
}>()

const form = ref({
  token: props.token,
  email: props.email,
  password: '',
  password_confirmation: '',
  processing: false,
})

function submit() {
  form.value.processing = true
  api
    .post('/reset-password', form.value)
    .then(() => {
      form.value.password = ''
      form.value.password_confirmation = ''
    })
    .finally(() => {
      form.value.processing = false
    })
}
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <Label for="email" value="Email" />
      <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required autofocus />
    </div>

    <div class="mt-4">
      <Label for="password" value="Password" />
      <Input
        id="password"
        type="password"
        class="mt-1 block w-full"
        v-model="form.password"
        required
        autocomplete="new-password"
      />
    </div>

    <div class="mt-4">
      <Label for="password_confirmation" value="Confirm Password" />
      <Input
        id="password_confirmation"
        type="password"
        class="mt-1 block w-full"
        v-model="form.password_confirmation"
        required
        autocomplete="new-password"
      />
    </div>

    <div class="mt-4 flex items-center justify-end">
      <Button :class="{ 'opacity-25': form.processing }" :disabled="form.processing"> Reset Password </Button>
    </div>
  </form>
</template>
