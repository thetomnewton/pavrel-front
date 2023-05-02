<script setup lang="ts">
useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 bg-white' },
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
</script>

<template>
  <div class="h-screen w-full overflow-hidden">
    <div class="mx-auto flex h-full max-w-7xl px-6 lg:px-10">
      <section class="relative h-full w-[270px] bg-slate-50 py-4 pl-2 pr-4">
        <div class="absolute right-[100%] top-0 z-10 h-full w-screen bg-slate-50"></div>

        <div class="flex items-center text-sm font-medium text-slate-700">
          <NuxtLink to="/" class="py-3">
            <span class="sr-only">Pavrel</span>
            <LogoColorText class="h-[30px] w-[96px] text-slate-800" />
          </NuxtLink>

          <span class="mx-1.5 mt-0.5">|</span>

          <NuxtLink href="/docs" class="mt-0.5 py-1 pr-2 hover:text-black">Documentation</NuxtLink>
        </div>

        <nav class="mt-4">
          <NuxtLink
            class="flex rounded-md py-1 text-sm font-medium leading-5"
            :class="{
              'font-semibold text-blue-600': $route.path === '/docs',
              'text-slate-600 hover:text-slate-800': $route.path !== '/docs',
            }"
            href="/docs"
            >Getting started</NuxtLink
          >
          <NuxtLink
            class="flex rounded-md py-1 text-sm font-medium leading-5"
            :class="{
              'font-semibold text-blue-600': $route.path === '/docs/workspaces',
              'text-slate-600 hover:text-slate-800': $route.path !== '/docs/workspaces',
            }"
            href="/docs/workspaces"
            >Workspaces</NuxtLink
          >
          <NuxtLink
            class="flex rounded-md py-1 text-sm font-medium leading-5"
            :class="{
              'font-semibold text-blue-600': $route.path === '/docs/teams',
              'text-slate-600 hover:text-slate-800': $route.path !== '/docs/teams',
            }"
            href="/docs/teams"
            >Teams</NuxtLink
          >
        </nav>
      </section>

      <section class="h-full flex-1 overflow-auto px-6 py-6 lg:px-10">
        <div class="mb-4 flex justify-end space-x-4 pt-1 text-sm">
          <a
            href="mailto:support@pavrel.com"
            class="inline-flex px-3 py-1 leading-6 text-slate-500 hover:text-slate-800"
            >Contact us</a
          >

          <NuxtLink
            href="/login"
            class="inline-flex rounded-md border border-slate-200 py-1 px-3 font-medium leading-6 text-slate-800 hover:border-slate-300 hover:bg-slate-50"
          >
            Log in
          </NuxtLink>
        </div>

        <div class="mx-auto max-w-4xl">
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>
