<script setup lang="ts">
import { watchForDarkMode } from '~/helpers/dark'

useHead({
  bodyAttrs: {
    class: 'bg-white dark:bg-zinc-900 py-6 overflow-auto antialiased font-sans h-screen text-slate-900 py-6 sm:px-6',
  },
})

watchForDarkMode()
</script>

<template>
  <section class="mx-auto w-full px-4 sm:max-w-sm">
    <div class="mb-6 mt-12 flex justify-center">
      <AuthenticationCardLogo />
    </div>

    <slot />
  </section>
</template>
