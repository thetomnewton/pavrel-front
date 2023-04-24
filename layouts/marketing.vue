<script setup lang="ts">
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200' },
  title: 'Pavrel',
  meta: [
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: light)',
      content: '#ffffff',
    },
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: dark)',
      content: '#18181b',
    },
    { name: 'msapplication-TileColor', content: '#18181b' },
  ],
  link: [
    { rel: 'preload', href: '/fonts/Inter-roman.var.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'icon', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#18181b' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  ],
})

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="mx-auto max-w-4xl border-b border-slate-150 px-6 lg:px-8">
    <div class="flex items-center">
      <NuxtLink to="/" class="py-3">
        <span class="sr-only">Pavrel</span>
        <LogoColorText class="h-[30px] w-[96px] text-slate-800" />
      </NuxtLink>

      <div class="ml-10 hidden items-center sm:flex">
        <NuxtLink href="/#features" class="py-4 px-3 text-sm font-medium text-slate-900 hover:text-slate-900"
          >Features</NuxtLink
        >
        <NuxtLink href="/#pricing" class="py-4 px-3 text-sm font-medium text-slate-900 hover:text-slate-900"
          >Pricing</NuxtLink
        >
        <NuxtLink href="/changelog" class="px-3 py-4 text-sm font-medium text-slate-900 hover:text-slate-900"
          >Changelog</NuxtLink
        >
      </div>

      <div class="relative ml-auto flex items-center space-x-2">
        <NuxtLink
          to="/login"
          class="inline-block whitespace-nowrap rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 transition-all hover:shadow-sm active:translate-y-px active:shadow-none"
        >
          Log in
        </NuxtLink>

        <div class="flex sm:hidden">
          <button type="button" class="rounded-md py-2 px-3" @click="mobileMenuOpen = true">
            <Bars3Icon class="h-6 w-6" />
          </button>
        </div>

        <div
          v-if="mobileMenuOpen"
          class="absolute top-0 right-0 min-w-[250px] rounded-lg border border-slate-200 bg-white pb-1.5 shadow-md sm:hidden"
        >
          <div class="text-right">
            <button type="button" class="p-2" @click="mobileMenuOpen = false">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="-mt-2">
            <NuxtLink
              @click="mobileMenuOpen = false"
              href="/#features"
              class="block w-full px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100 hover:text-slate-900"
              >Features</NuxtLink
            >
            <NuxtLink
              @click="mobileMenuOpen = false"
              href="/#pricing"
              class="block w-full px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100 hover:text-slate-900"
              >Pricing</NuxtLink
            >
            <NuxtLink
              @click="mobileMenuOpen = false"
              href="/changelog"
              class="block w-full px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100 hover:text-slate-900"
              >Changelog</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>
  <footer></footer>
</template>
