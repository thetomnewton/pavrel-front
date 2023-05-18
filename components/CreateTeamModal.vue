<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import { computed, ref, watch } from 'vue'
import { Team } from '../types'
import CreateTeamForm from './CreateTeamForm.vue'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'
import { useOnline } from '@vueuse/core'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import { useStore } from 'vuex'

const online = useOnline()
const store = useStore()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close', 'saved'])

const newTeam = ref<{
  name: Team['name']
  slug: Team['slug']
  privacy: Team['privacy']
}>({
  name: '',
  slug: '',
  privacy: 'public',
})

const status = ref<'idle' | 'creating'>('idle')

function attemptTeamCreation() {
  status.value = 'creating'

  createTeam(newTeam.value).then(data => {
    store.commit('base/showToast', { type: 'team-creation', data })
    emit('saved', data)
  })

  emit('close')
  newTeam.value = {
    name: '',
    slug: '',
    privacy: 'public',
  }
  status.value = 'idle'
}

watch(
  () => props.open,
  newValue => {
    if (newValue) {
      newTeam.value = {
        name: '',
        slug: '',
        privacy: 'public',
      }
    }
  }
)

const { currentWorkspaceTeams, createTeam } = useTeams()
const slugAlreadyExists = computed(() => currentWorkspaceTeams.value?.find(team => team.slug === newTeam.value.slug))
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[550px] rounded-md bg-white shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
        >
          <form @submit.prevent="attemptTeamCreation" class="px-8 py-6">
            <h3 class="mb-4 font-semibold">Create new team</h3>

            <div
              v-if="!online"
              class="mb-6 flex items-start rounded-md bg-red-100 px-6 py-4 text-sm font-medium text-red-800"
            >
              <ExclamationTriangleIcon class="mr-2 mt-px h-6 w-6" />
              <span>You can't create a new team because you are offline.</span>
            </div>

            <CreateTeamForm
              v-model:name="newTeam.name"
              v-model:slug="newTeam.slug"
              v-model:privacy="newTeam.privacy"
              :slug-already-exists="slugAlreadyExists"
            />

            <div class="mt-8 text-right">
              <button
                type="button"
                @click="$emit('close')"
                class="mr-2 cursor-default px-4 py-2 text-sm font-medium leading-5 text-slate-600 hover:text-slate-800 dark:text-zinc-300"
              >
                Cancel
              </button>
              <Button type="submit" :disabled="!online || status === 'creating' || slugAlreadyExists">
                Create team
              </Button>
            </div>
          </form>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
