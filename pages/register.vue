<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from '~~/api'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Create an account',
})

const form = ref({
  processing: false,
  data: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  },
})

const error = ref<{ errors: string[] } | null>(null)

const name = ref<HTMLInputElement | null>(null)

onMounted(() => {
  name.value?.focus()
})

function csrf() {
  return axios.get('/sanctum/csrf-cookie')
}

const submit = async () => {
  form.value.processing = true
  error.value = null
  await csrf()

  axios
    .post('/register', form.value.data)
    .then(() => {
      form.value.data.password = ''
      form.value.data.password_confirmation = ''
      location.href = '/welcome'
    })
    .catch(({ response }) => {
      error.value = response.data
    })
    .finally(() => {
      form.value.processing = false
    })
}
</script>

<template>
  <div class="pb-24">
    <div class="mb-6 text-center">
      <h1 class="mb-1 text-2xl font-semibold text-slate-800 dark:text-zinc-200">Sign up</h1>
      <NuxtLink
        to="/login"
        class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
      >
        Already have an account? Log in
      </NuxtLink>
    </div>

    <div>
      <ContinueWithGoogleLink />
    </div>

    <OrBadge />

    <ValidationErrors v-if="error" class="mb-6" :error="error" />

    <form @submit.prevent="submit">
      <div>
        <Label for="name" value="Name" />
        <Input
          id="name"
          type="text"
          class="mt-1 block w-full"
          v-model="form.data.name"
          required
          ref="name"
          autofocus
          autocomplete="name"
        />
      </div>

      <div class="mt-6">
        <Label for="email" value="Email" />
        <Input id="email" type="email" class="mt-1 block w-full" v-model="form.data.email" required />
      </div>

      <div class="mt-6">
        <Label for="password" value="Password" />
        <Input
          id="password"
          type="password"
          class="mt-1 block w-full"
          v-model="form.data.password"
          required
          autocomplete="new-password"
        />
      </div>

      <div class="mt-6">
        <Label for="password_confirmation" value="Confirm Password" />
        <Input
          id="password_confirmation"
          type="password"
          class="mt-1 block w-full"
          v-model="form.data.password_confirmation"
          required
          autocomplete="new-password"
        />
      </div>

      <div class="mt-6">
        <Label for="terms">
          <div class="flex items-center">
            <Checkbox name="terms" id="terms" v-model:checked="form.data.terms" required />

            <div class="ml-2">
              I agree to the
              <a
                target="_blank"
                href="/terms"
                class="text-sm text-slate-600 underline hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200"
                >Terms of Service</a
              >
              and
              <a
                target="_blank"
                href="/privacy"
                class="text-sm text-slate-600 underline hover:text-slate-900 dark:text-zinc-300 dark:hover:text-zinc-200"
                >Privacy Policy</a
              >
            </div>
          </div>
        </Label>
      </div>

      <div class="mt-6">
        <Button class="w-full" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
          Register
        </Button>
      </div>
    </form>
  </div>
</template>
