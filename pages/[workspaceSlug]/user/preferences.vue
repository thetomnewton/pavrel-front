<script setup lang="ts">
import { ref } from 'vue'
import { ComputerDesktopIcon, SunIcon, MoonIcon } from '@heroicons/vue/20/solid'

definePageMeta({
  layout: 'settings',
})

const theme = ref((localStorage && localStorage.colorTheme) || 'system')

function updateTheme(newTheme: string) {
  theme.value = newTheme

  if (newTheme === 'system') localStorage.removeItem('colorTheme')
  else localStorage.colorTheme = newTheme

  const hasSystemDarkTheme =
    !('colorTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches

  if (newTheme === 'dark' || (newTheme === 'system' && hasSystemDarkTheme))
    document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}
</script>

<template>
  <div class="mx-auto max-w-4xl py-10 px-6 lg:px-8">
    <div class="mb-8 border-b border-slate-200 pb-8 dark:border-zinc-700">
      <div class="text-[22px] font-medium">Preferences</div>
    </div>

    <div>
      <div class="md:flex">
        <div class="md:mr-6 md:w-1/3">
          <h3 class="text-lg font-medium text-slate-900 dark:text-zinc-200">Display</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-zinc-400">Set your visual preferences</p>
        </div>

        <div class="mt-5 md:mt-0 md:flex-1">
          <div>
            <div class="mb-1">
              <FormLabel for="colorTheme">Color theme</FormLabel>
            </div>

            <div class="max-w-[350px]">
              <Listbox
                :value="theme"
                @update-value="updateTheme"
                :options="[
                  { text: `System`, value: 'system', icon: ComputerDesktopIcon },
                  { text: `Light`, value: 'light', icon: SunIcon },
                  { text: `Dark`, value: 'dark', icon: MoonIcon },
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
