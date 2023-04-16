<script setup lang="ts">
import dayjs from 'dayjs'
import api from '../api'
import { User, Workspace, WorkspaceInvitation } from '../types'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash-es'
import BaseDialog from './BaseDialog.vue'

const store = useStore()

const props = defineProps<{
  open: boolean
  workspace: Workspace
}>()

const emit = defineEmits(['close'])

const { user } = useUsers()

const sending = ref(false)
const emails = ref('')
const error = ref(null)
const pending = computed<WorkspaceInvitation[]>(() => store.state.base.workspaceInvitations)
const existingUsers = ref<User[]>([])
const validation = ref<{
  alreadyInvited: string[]
  existingUsers: string[]
}>({
  alreadyInvited: [],
  existingUsers: [],
})

const emailsInput = ref<HTMLInputElement | null>(null)

const exampleDomain = computed(() => user.value.email.split('@')[1])

const hasValidationErrors = computed(
  () => !!(validation.value.alreadyInvited.length || validation.value.existingUsers.length)
)

watch(
  () => props.open,
  value => {
    if (!value) return

    if (!pending.value.length) getPending()
    if (!existingUsers.value.length) getExistingUsers()
  }
)

watch(emails, () => runValidation())

const close = () => emit('close')

function runValidation() {
  validation.value.alreadyInvited = []
  validation.value.existingUsers = []

  const localEmails = emails.value.split(',').map(x => x.toLowerCase().trim())

  localEmails.forEach(email => {
    // Check if already invited
    if (pending.value.find(pending => pending.email.toLowerCase() === email))
      validation.value.alreadyInvited.push(email)

    // Check if existing workspace user
    if (existingUsers.value.find(user => user.email.toLowerCase() === email)) validation.value.existingUsers.push(email)
  })
}

function sendInvites() {
  sending.value = true
  error.value = null

  api
    .post(`/workspaces/${props.workspace.id}/invitations`, {
      emails: emails.value.split(','),
    })
    .then(({ data }: { data: WorkspaceInvitation[] }) => {
      close()
      emails.value = ''

      setTimeout(() => {
        const newInvites = cloneDeep(pending.value)
        newInvites.unshift(...data)
        store.commit('base/setWorkspaceInvitations', newInvites)
      }, 150)
    })
    .catch(({ response }) => {
      // todo: error handling
      if (response.status === 422) error.value = response.data.message
    })
    .finally(() => {
      sending.value = false
    })
}

function getPending() {
  api.get(`/workspaces/${props.workspace.id}/invitations/pending`).then(({ data }) => {
    store.commit('base/setWorkspaceInvitations', data)
  })
}

function getExistingUsers() {
  api.get(`/workspaces/${props.workspace.id}/users`).then(({ data }) => {
    existingUsers.value = data
  })
}

const niceDate = (string: string) => dayjs(string).format('MMM DD YYYY, H:mm')

function resendInvitation(email: string) {
  const invite = pending.value.find(item => item.email === email)
  if (!invite) return

  const updatedInvite = cloneDeep(invite)
  updatedInvite.resent_at = new Date().toISOString()

  store.commit('base/updateWorkspaceInvitation', updatedInvite)
}

function canResend(invite: WorkspaceInvitation) {
  return dayjs(invite.resent_at ?? invite.created_at).isBefore(dayjs().subtract(1, 'hour'))
}

function cancelInvite(invite: WorkspaceInvitation) {
  store.commit('base/cancelWorkspaceInvitation', invite)

  api.post(`/workspaces/${props.workspace.id}/invitations/${invite.id}/cancel`).catch(() => {
    store.commit('base/createWorkspaceInvitation', invite)
  })
}
</script>

<template>
  <BaseDialog
    :open="open"
    :initial-focus="emailsInput ?? undefined"
    @close="emit('close')"
    class="mx-auto w-full max-w-[500px] rounded-lg border bg-white px-8 py-6 shadow-3xl dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
  >
    <h3 class="mb-6 font-semibold">Invite people to the {{ workspace?.name }} workspace</h3>

    <form @submit.prevent="sendInvites">
      <div class="">
        <Alert v-if="error" class="mb-4">{{ error }} Please check your inputs and try again.</Alert>

        <Alert v-if="validation.alreadyInvited.length" class="mb-4">
          These people have already been invited:
          <span class="font-medium">{{ validation.alreadyInvited.join(', ') }}</span>
        </Alert>

        <Alert v-if="validation.existingUsers.length" class="mb-4">
          These people already have an account on your workspace:
          <span class="font-medium">{{ validation.existingUsers.join(', ') }}</span>
        </Alert>

        <Label class="mb-1" for="emailsInput">Email(s):</Label>

        <div class="mb-4">
          <textarea
            id="emailsInput"
            ref="emailsInput"
            class="block w-full resize-none rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 sm:text-sm"
            :placeholder="`e.g. person1@${exampleDomain}, person2@${exampleDomain}`"
            :value="emails"
            @input="emails = ($event?.target as HTMLInputElement).value"
            required
          >
          </textarea>
        </div>

        <div class="text-right">
          <button
            type="button"
            class="mr-1 cursor-default appearance-none rounded-md px-4 py-2 text-sm font-medium leading-5 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-300"
            @click="close"
          >
            Cancel
          </button>
          <Button type="submit" :disabled="sending || hasValidationErrors"> Send invites </Button>
        </div>
      </div>
    </form>

    <div
      v-if="pending && pending.length"
      class="-mx-8 mt-4 -mb-4 max-h-[400px] overflow-auto border-t border-slate-200 px-8 pb-6 pt-4 text-[14px] dark:border-zinc-700"
    >
      <div class="mb-2 font-medium">Pending invites ({{ pending.length }}):</div>

      <div v-for="item in pending" :key="item.email" class="mb-2">
        <span>{{ item.email }}</span>
        <div class="ml-auto">
          <span class="mr-4 text-xs text-slate-500 dark:text-zinc-400">
            Last sent: {{ niceDate(item.resent_at ?? item.created_at) }}
          </span>

          <template v-if="canResend(item)">
            <span
              @click="resendInvitation(item.email)"
              class="cursor-pointer font-medium text-blue-500 hover:underline"
            >
              Resend
            </span>
          </template>

          <template v-else>
            <span class="cursor-default text-slate-400">Sent</span>
          </template>

          <span @click="cancelInvite(item)" class="ml-4 cursor-pointer font-medium text-blue-500 hover:underline">
            Cancel
          </span>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>
