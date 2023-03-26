<script setup lang="ts">
useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/favicon.svg' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  ],
})
</script>

<template>
  <header class="mx-auto max-w-4xl px-8 pt-4">
    <div class="flex items-center">
      <NuxtLink to="/">
        <span class="sr-only">Pavrel</span>
        <LogoColorText class="h-[30px] w-[96px] text-slate-800" />
      </NuxtLink>

      <div class="ml-10 flex items-center space-x-6">
        <a href="#features" class="text-sm font-medium text-slate-900 hover:text-slate-900">Features</a>
        <a href="#pricing" class="text-sm font-medium text-slate-900 hover:text-slate-900">Pricing</a>
      </div>

      <div class="ml-auto">
        <NuxtLink
          to="/login"
          class="inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 transition-all hover:shadow-sm active:translate-y-px active:shadow-none"
          >Log in</NuxtLink
        >
      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>
  <footer></footer>
</template>
