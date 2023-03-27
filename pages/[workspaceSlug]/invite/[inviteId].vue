<script>
import api from '../../../api'
import { mapState } from 'vuex'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Join a workspace on Pavrel',
})

const { $apiFetch } = useNuxtApp()

function csrf() {
  return $apiFetch('/sanctum/csrf-cookie')
}

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
      },

      invite: null,
      workspace: null,

      invalidInvite: false,

      loggedOutUserStep: 'check_email',
    }
  },

  computed: {
    ...mapState('base', ['user', 'workspaces']),

    isLoggedIn() {
      return this.user != null
    },

    userAlreadyInWorkspace() {
      if (!this.isLoggedIn) return false

      return this.workspaces.find(({ id }) => id === this.workspace.id) != null
    },
  },

  created() {
    api
      .get(`/workspaces/search?slug=${this.$route.params.workspaceSlug}`)
      .then(({ data }) => {
        this.workspace = data
        api
          .get(`/workspaces/${this.workspace.id}/invitations/${this.$route.params.inviteId}`)
          .then(({ data }) => {
            this.invite = data
            this.form.email = this.invite.email
            if (this.invite?.claimed_at != null) this.invalidInvite = true
          })
          .catch(() => {
            this.invalidInvite = true
          })
      })
      .catch(() => {
        this.$router.push('/')
      })
  },

  mounted() {
    this.$refs.name?.focus()
  },

  methods: {
    async submitAndRegister() {
      await csrf()

      api
        .post(`/workspaces/${this.workspace.id}/invitations/${this.$route.params.inviteId}/claim`, this.form)
        .then(() => {
          api
            .post('/login', {
              email: this.form.email,
              password: this.form.password,
            })
            .then(() => {
              this.form.password = ''
              this.form.password_confirmation = ''
              this.$router.push(`/${this.workspace.slug}/drafts`)
            })
        })
    },

    checkEmail() {
      api
        .get(`/users/search?email=${this.form.email}`)
        .then(({ data }) => {
          this.loggedOutUserStep = 'login'
        })
        .catch(({ response }) => {
          this.loggedOutUserStep = 'register'
        })
    },

    async submitAndLogin() {
      await csrf()
      api
        .post(`/workspaces/${this.workspace.id}/invitations/${this.$route.params.inviteId}/claim`, {
          email: this.form.email,
          password: this.form.password,
        })
        .then(() => {
          this.form.password = ''
          this.$router.push(`/${this.workspace.slug}/drafts`)
        })
    },

    joinWorkspace() {
      api
        .post(`/workspaces/${this.workspace.id}/invitations/${this.$route.params.inviteId}/claim`)
        .then(() => {
          this.$router.push(`/${this.workspace.slug}/drafts`)
        })
        .catch(error => {
          // todo: catch errors
        })
    },
  },
}
</script>

<template>
  <div v-if="workspace">
    <div class="mb-6 text-center">
      <h1 class="mb-2 text-2xl font-semibold text-slate-800 dark:text-zinc-200">
        Join the {{ workspace.name }} workspace
      </h1>
      <p class="mb-2 text-sm text-slate-600 dark:text-zinc-400">
        Pavrel is a place for your team to create, share and shape ideas togther.
      </p>
    </div>

    <template v-if="invite">
      <template v-if="!invalidInvite">
        <template v-if="!isLoggedIn">
          <div>
            <ContinueWithGoogleLink source="invite" :meta="invite.id" />
            <!-- <ContinueWithMicrosoftLink /> -->
          </div>

          <OrBadge />

          <form @submit.prevent="checkEmail" v-if="loggedOutUserStep === 'check_email'">
            <div class="mt-6">
              <Label for="email" value="Email" />
              <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required />
            </div>

            <div class="mt-5">
              <Button class="w-full">Continue</Button>
            </div>
          </form>

          <div v-else-if="loggedOutUserStep === 'register'">
            <ValidationErrors class="mb-6" />

            <form @submit.prevent="submitAndRegister">
              <div>
                <Label for="name" value="Name" />
                <Input
                  id="name"
                  type="text"
                  class="mt-1 block w-full"
                  v-model="form.name"
                  required
                  ref="name"
                  autofocus
                  autocomplete="name"
                />
              </div>

              <div class="mt-6">
                <Label for="email" value="Email" />
                <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required />
              </div>

              <div class="mt-6">
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

              <div class="mt-6">
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

              <div class="mt-6">
                <Label for="terms">
                  <div class="flex items-center">
                    <Checkbox name="terms" id="terms" v-model:checked="form.terms" required />

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

              <div class="mt-6 mb-12">
                <Button class="w-full" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                  Register
                </Button>
              </div>
            </form>
          </div>

          <div v-else>
            <form @submit.prevent="submitAndLogin">
              <div class="mt-6">
                <Label for="email" value="Email" />
                <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required />
              </div>

              <div class="mt-6">
                <Label for="password">
                  <div class="flex items-center">
                    <span>Password</span>
                    <span class="ml-auto">
                      <NuxtLink to="/password/request" class="text-sm font-medium text-blue-600 hover:text-blue-500">
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
                  autocomplete="new-password"
                />
              </div>

              <div class="mt-6">
                <Button class="w-full" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                  Log in and join workspace
                </Button>
              </div>
            </form>
          </div>
        </template>

        <template v-else>
          <div class="mb-6 flex items-center rounded border border-slate-200 px-4 py-3 text-sm">
            <div class="mr-4">
              <WorkspaceIcon :size="24" class="mr-[10px] bg-blue-500" :initial="workspace.initial" />
            </div>

            <div class="flex-1">
              <div class="font-medium">{{ workspace.name }}</div>
              <div class="text-[.8125rem]">{{ workspace.users_count }} members</div>
            </div>
          </div>

          <div class="mb-6 flex items-center rounded border border-slate-200 px-4 py-3 text-sm">
            <div class="mr-4">
              <img class="h-[24px] w-[24px] min-w-[24px] rounded-full object-cover" :src="user.profile_photo_url" />
            </div>

            <div class="flex-1">
              <div class="font-medium">{{ user.name }}</div>
              <div class="text-[.8125rem]">{{ user.email }}</div>
            </div>
          </div>

          <template v-if="!userAlreadyInWorkspace">
            <div>
              <Button class="w-full" @click="joinWorkspace">Join</Button>
            </div>
          </template>

          <template v-else>
            <div class="mb-5 text-center">You're already a member of this workspace.</div>
            <div>
              <Button class="w-full" @click="$router.push(`/${workspace.slug}/drafts`)">Go to workspace</Button>
            </div>
          </template>
        </template>
      </template>

      <template v-else>
        <div class="rounded-md border border-slate-200 p-5 text-center">
          <p class="mb-4">This invitation has already been claimed.</p>
          <p>
            <Button onclick="$router.push('/login')" class="rounded-md px-5 py-2 shadow">
              {{ isLoggedIn ? 'Back to Pavrel' : 'Back to login' }}
            </Button>
          </p>
        </div>
      </template>
    </template>

    <template v-else-if="invalidInvite">
      <div class="text-center">
        <p class="mb-3">This invitation link is not valid.</p>
        <p>Please request another one from a workspace administrator.</p>
      </div>
    </template>
  </div>
</template>
