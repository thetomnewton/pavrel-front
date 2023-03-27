<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'
import {
  AdjustmentsVerticalIcon,
  ClockIcon,
  CodeBracketIcon,
  LifebuoyIcon,
  LightBulbIcon,
  LinkIcon,
  LockClosedIcon,
  PaperClipIcon,
} from '@heroicons/vue/20/solid'
import { PresentationChartLineIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useStore } from 'vuex'
import ModalBg from './ModalBg.vue'
import ModalWrapper from './ModalWrapper.vue'

const { currentWorkspace } = useWorkspace()
const store = useStore()

const ideas = computed(() => store.state.base.ideas.length)

defineProps<{
  open: boolean
}>()

defineEmits(['close'])
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10" @click.self="$emit('close')">
      <ModalBg />

      <ModalWrapper>
        <DialogPanel
          class="mx-auto w-full max-w-[850px] rounded-md bg-white shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
        >
          <div class="border-b border-slate-100 dark:border-zinc-700 md:flex">
            <div class="border-slate-100 px-8 py-6 dark:border-zinc-700 md:w-1/2 md:border-r">
              <div class="mb-4 mt-6">
                <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <PresentationChartLineIcon class="mt-[2px] h-6 w-6 text-blue-800" />
                </span>
              </div>

              <h3 class="text-[17px] font-medium dark:text-white">Upgrade the {{ currentWorkspace.name }} workspace</h3>
              <div class="mt-4 mb-6 text-sm text-slate-500 dark:text-zinc-300">
                You are currently on the
                <span class="text-slate-900 dark:font-semibold dark:text-zinc-100">Free</span> plan. Upgrade to remove
                limits and access the full power of Pavrel.
              </div>

              <div>
                <div class="relative h-[2px] rounded bg-slate-200 dark:bg-zinc-700">
                  <span
                    class="absolute top-0 left-0 h-full rounded-l"
                    :class="{
                      'bg-green-700 dark:bg-green-400': ideas < 80,
                      'bg-orange-600': ideas >= 80 && ideas < 100,
                      'rounded-r bg-red-700': ideas >= 100,
                    }"
                    :style="{ width: `${ideas <= 100 ? ideas : 100}%` }"
                  ></span>
                </div>
                <div class="mt-1.5 text-[.8125rem] text-slate-500 dark:text-zinc-300">
                  <span
                    :class="{
                      'text-green-700 dark:text-green-400': ideas < 80,
                      'text-orange-600': ideas >= 80 && ideas < 100,
                      'rounded-r text-red-700': ideas >= 100,
                    }"
                    >{{ ideas }}</span
                  >
                  / 100 ideas
                </div>
              </div>
            </div>

            <div class="px-8 py-6 md:w-1/2 md:bg-slate-50 md:dark:bg-zinc-900">
              <h4 class="mb-6 font-medium md:mt-5">Paid features</h4>

              <div class="mb-6 grid grid-cols-2 gap-y-6 gap-x-4 text-sm text-slate-800 dark:text-zinc-200">
                <div class="flex items-center space-x-2">
                  <LightBulbIcon class="h-4 w-4 text-blue-500" />
                  <span>Unlimited ideas</span>
                </div>
                <div class="flex items-center space-x-2">
                  <LockClosedIcon class="h-4 w-4 text-blue-500" />
                  <span>Private teams</span>
                </div>
                <div class="flex items-center space-x-2">
                  <PaperClipIcon class="h-4 w-4 text-blue-500" />
                  <span>Unlimited file uploads</span>
                </div>
                <div class="flex items-center space-x-2">
                  <ClockIcon class="h-4 w-4 text-blue-500" />
                  <span>Version history</span>
                </div>
                <div class="flex items-center space-x-2">
                  <LifebuoyIcon class="h-4 w-4 text-blue-500" />
                  <span>Priority support</span>
                </div>
                <div class="flex items-center space-x-2">
                  <LinkIcon class="h-4 w-4 text-blue-500" />
                  <span>Integrations</span>
                </div>
                <div class="flex items-center space-x-2">
                  <CodeBracketIcon class="h-4 w-4 text-blue-500" />
                  <span>API</span>
                </div>
                <div class="flex items-center space-x-2">
                  <AdjustmentsVerticalIcon class="h-4 w-4 text-blue-500" />
                  <span>Admin tools</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2 px-8 py-4">
            <button
              type="button"
              class="inline-flex cursor-default appearance-none items-center justify-center rounded-md bg-transparent px-3 py-1.5 text-[.8125rem] font-medium leading-5 text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:active:bg-zinc-700/50"
              @click="$emit('close')"
            >
              Close
            </button>

            <RouterLink
              :to="`/${currentWorkspace.slug}/settings/plans`"
              class="inline-flex cursor-default appearance-none items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-[.8125rem] font-medium leading-5 text-white active:bg-blue-700"
            >
              Select plan
            </RouterLink>
          </div>
        </DialogPanel>
      </ModalWrapper>
    </Dialog>
  </TransitionRoot>
</template>
