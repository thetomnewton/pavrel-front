<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()

const toggleQuickCreateIdeaModal = () => store.commit('base/toggleQuickCreateIdeaModal')
</script>

<template>
  <section
    class="flex flex-1 items-center justify-center overflow-auto text-slate-600 dark:text-zinc-400"
    style="height: calc(100% - 58px)"
  >
    <div class="pb-16">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          aria-hidden="true"
          class="mx-auto h-[72px] w-[72px]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          ></path>
        </svg>
      </div>

      <div class="mt-3 text-[.8125rem] font-medium">
        <p class="mb-[2px]">Feeling inspired?</p>

        <p class="text-center">
          <span @click="toggleQuickCreateIdeaModal" class="cursor-pointer font-medium text-blue-500 hover:underline">
            Add an idea
          </span>
        </p>
      </div>
    </div>
  </section>
</template>
