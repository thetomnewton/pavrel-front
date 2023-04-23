<script setup lang="ts">
import { useStore } from 'vuex'
import { Workspace } from '~~/types'
import { csrf } from '~~/helpers/auth'
import axios from '~~/api'

const store = useStore()
const router = useRouter()

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Log in',
})

const form = ref({
  email: '',
  password: '',
  remember: 'on',
})

const sending = ref(false)
const error = ref<{ errors: string[] } | null>(null)
const email = ref<HTMLInputElement | null>(null)

onMounted(() => {
  setTimeout(() => email.value?.focus())
})

async function submit() {
  sending.value = true
  error.value = null

  await csrf()
  axios
    .post('/login', form.value)
    .then(() => {
      Promise.all([axios.get('/user'), axios.get('/workspaces')]).then(responses => {
        const [{ data: user }, { data: workspaces }] = responses

        store.commit('base/setUser', user)
        store.commit('base/setWorkspaces', workspaces)

        if ((workspaces as Workspace[]).length) {
          store.commit('base/setCurrentWorkspaceFromMostRecent')
          router.push(`/${store.getters['base/currentWorkspace'].slug}/drafts`)
        } else router.push(`/welcome`)
      })
    })
    .catch(({ response }) => {
      error.value = response.data
      sending.value = false
    })
}
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h1 class="mb-1 text-2xl font-semibold text-slate-800 dark:text-zinc-200">Log in</h1>

      <NuxtLink
        to="/register"
        class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
      >
        Don't have an account? Sign up
      </NuxtLink>
    </div>

    <div>
      <ContinueWithGoogleLink>Log in with Google</ContinueWithGoogleLink>
    </div>

    <OrBadge />

    <ValidationErrors v-if="error" class="mb-4" :error="error" />

    <form @submit.prevent="submit">
      <div>
        <Label for="email" value="Email" />
        <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required ref="email" autofocus />
      </div>

      <div class="mt-6">
        <Label for="password">
          <div class="flex items-center">
            <span>Password</span>
            <span class="ml-auto">
              <NuxtLink
                to="/password/request"
                class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
              >
                Forgot password?
              </NuxtLink>
            </span>
          </div>
        </Label>

        <Input
          id="password"
          type="password"
          class="mt-1 block w-full"
          v-model="form.password"
          required
          autocomplete="current-password"
        />
      </div>

      <div class="mt-6">
        <Button class="w-full" :class="{ 'opacity-25': sending }" :disabled="sending"> Log in </Button>
      </div>
    </form>
  </div>
</template>
