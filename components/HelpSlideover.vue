<script setup lang="ts">
import { ArrowLongLeftIcon, ArrowTopRightOnSquareIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { BoltIcon, BookOpenIcon, InboxArrowDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])

const panel = ref<'main' | 'keyboardShortcuts'>('main')

watch(
  () => props.open,
  value => {
    if (value) panel.value = 'main'
  }
)

const actionKey = useActionKey()

function showKeyboardShortcuts() {
  panel.value = 'keyboardShortcuts'
}

const keyboardShortcuts = computed(() => [
  {
    text: 'Quick create idea',
    keys: ['q'],
  },
  {
    text: 'Quick find idea',
    keys: ['/'],
  },
  {
    text: 'Open Help & Support',
    keys: ['?'],
  },
  {
    text: 'Switch to list view',
    keys: ['['],
  },
  {
    text: 'Switch to board view',
    keys: [']'],
  },
  {
    text: 'Select all ideas',
    keys: [actionKey.value[0], 'a'],
  },
])
</script>

<template>
  <div
    class="fixed inset-0 z-40 flex justify-end transition"
    :class="{ 'bg-black/20 dark:bg-black/50': open, 'pointer-events-none opacity-0': !open }"
    @click.self="emit('close')"
  >
    <div
      class="min-w-[350px] bg-white shadow-md transition dark:border-l dark:border-zinc-600 dark:bg-zinc-900 lg:min-w-[400px]"
      :class="{ 'translate-x-[20px]': !open }"
    >
      <div v-if="panel === 'main'">
        <h3 class="mb-6 flex items-center px-8 pt-6 font-semibold">
          <span>Help & Support</span>
          <span class="ml-auto">
            <button
              type="button"
              @click="emit('close')"
              class="p-1 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </span>
        </h3>

        <div class="space-y-4 px-8">
          <NuxtLink
            href="/docs"
            target="_blank"
            rel="noreferrer"
            class="flex w-full cursor-pointer items-center rounded-md border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-800 hover:border-slate-300 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <BookOpenIcon class="mr-3 h-6 w-6" />
            <span>View documentation</span>
            <span class="ml-auto pl-2">
              <ArrowTopRightOnSquareIcon class="h-5 w-5 text-slate-500 dark:text-zinc-400" />
            </span>
          </NuxtLink>

          <a
            href="mailto:support@pavrel.com"
            target="_blank"
            rel="noreferrer"
            class="flex w-full cursor-pointer items-center rounded-md border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-800 hover:border-slate-300 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <InboxArrowDownIcon class="mr-3 h-6 w-6" />
            <span>Email us</span>
            <span class="ml-auto pl-2">
              <ArrowTopRightOnSquareIcon class="h-5 w-5 text-slate-500 dark:text-zinc-400" />
            </span>
          </a>

          <button
            type="button"
            class="flex w-full cursor-pointer rounded-md border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-800 hover:border-slate-300 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-800"
            @click="showKeyboardShortcuts"
          >
            <BoltIcon class="mr-3 h-6 w-6" />
            <span>Keyboard shortcuts</span>

            <ChevronRightIcon class="ml-auto h-5 w-5" />
          </button>
        </div>
      </div>

      <div v-else-if="panel === 'keyboardShortcuts'">
        <h3 class="mb-6 flex items-center px-8 pt-6 font-semibold">
          <button type="button" @click="panel = 'main'">
            <ArrowLongLeftIcon class="mr-2 h-5 w-5" />
          </button>

          <span>Keyboard shortcuts</span>

          <span class="ml-auto">
            <button
              type="button"
              @click="emit('close')"
              class="p-1 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </span>
        </h3>

        <div class="px-8">
          <div
            v-for="shortcut in keyboardShortcuts"
            :key="shortcut.text"
            class="flex items-center text-sm leading-8 text-slate-700"
          >
            <span>{{ shortcut.text }}</span>
            <span class="ml-auto flex items-center space-x-1">
              <div
                v-for="key in shortcut.keys"
                :key="key"
                class="rounded bg-slate-100 px-1.5 text-[13px] font-medium leading-6 text-slate-600"
              >
                {{ key }}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
