<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

useHead({
  title: 'Pavrel',
  meta: [{ name: 'description', content: 'Unleash your creativity. Pavrel is a home for your ideas.' }],
  bodyAttrs: {
    class: 'bg-slate-50 antialiased font-sans',
  },
})
</script>

<template>
  <section class="mx-auto max-w-4xl pt-20 pb-20 px-6 lg:px-8 sm:pt-24">
    <h1 class="text-3xl font-semibold tracking-tight sm:text-5xl text-slate-900">Unleash your creativity.</h1>
    <p class="mt-3 text-lg font-medium leading-8 text-slate-500">
      Pavrel is a home for your ideas. Designed for modern software teams.
    </p>

    <div class="mt-8">
      <NuxtLink
        to="/register"
        class="inline-block rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 border border-blue-600 px-6 py-1.5 text-base font-semibold leading-7 outline-none text-white ring-0 focus:ring-2 focus:ring-offset-2 ring-blue-600 hover:bg-blue-700 hover:ring-blue-700 shadow-md transition-all active:from-blue-700 active:translate-y-px"
      >
        Get started free
      </NuxtLink>
    </div>

    <div class="text-xs mt-3 text-slate-500">No credit card required.</div>
  </section>
</template>
