<script setup lang="ts">
import api from '../../api'
import { onMounted, ref } from 'vue'

definePageMeta({
  layout: 'auth',
})

const form = ref({
  email: '',
})
const processing = ref(false)
const error = ref<{ errors: string[] } | null>(null)

const email = ref<HTMLInputElement | null>(null)

onMounted(() => email.value?.focus())

function submit() {
  processing.value = true
  error.value = null

  api
    .post('/forgot-password', form.value)
    .catch(({ response }) => {
      error.value = response.data
    })
    .finally(() => (processing.value = false))
}
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h1 class="mb-4 text-2xl font-semibold text-slate-800 dark:text-zinc-200">Forgot password</h1>
      <div class="text-sm text-slate-600 dark:text-zinc-400">
        Forgot your password? No problem. Let us know your email address below and we'll email you a password reset
        link.
      </div>
    </div>

    <ValidationErrors v-if="error" :error="error" class="mb-4" />

    <form @submit.prevent="submit">
      <div>
        <Label for="email" value="Email" />
        <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required ref="email" autofocus />
      </div>

      <div class="mt-6 flex items-center justify-end">
        <Button class="w-full" :class="{ 'opacity-25': processing }" :disabled="processing">
          Email password reset link
        </Button>
      </div>
    </form>
  </div>
</template>
