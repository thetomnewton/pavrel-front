<script setup lang="ts">
import { ArrowUpRightIcon } from '@heroicons/vue/20/solid'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

useHead({
  bodyAttrs: { class: 'antialiased h-screen text-slate-900 dark:text-zinc-200 bg-slate-100' },
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
          class="inline-block whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 transition-all hover:shadow-sm active:translate-y-px active:shadow-none"
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
          class="absolute top-0 right-0 w-full max-w-[250px] rounded-lg border border-slate-200 bg-white pb-1.5 shadow-md sm:hidden"
        >
          <div class="pr-0.5 text-right">
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

  <footer class="border-t border-slate-150 bg-gradient-to-b from-slate-50 to-white py-16 px-4 sm:px-6">
    <div class="mx-auto max-w-4xl space-y-8 px-6 md:flex md:items-start md:justify-between md:space-y-0 lg:px-8">
      <div class="w-full max-w-[250px] pt-1">
        <svg
          class="h-[27px] w-[24px]"
          width="86"
          height="98"
          viewBox="0 0 86 98"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M46 73.5V50.7435L83 29.6621V71.7565L46 92.8379V73.5ZM40 92.8379L3 71.7565V29.6621L40 50.7435V73.5V92.8379ZM79.94 24.5L43 45.5472L6.05999 24.5L43 3.45278L79.94 24.5Z"
            class="fill-slate-400 stroke-white dark:fill-white dark:stroke-zinc-900"
            stroke-width="1"
          />
        </svg>
      </div>

      <div class="w-full max-w-[250px]">
        <div class="mb-2 text-[13px] font-medium text-slate-700">Product</div>
        <NuxtLink href="/" class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-800">
          Home
        </NuxtLink>
        <NuxtLink
          href="/#features"
          class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700"
        >
          Features
        </NuxtLink>
        <NuxtLink
          href="/#pricing"
          class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700"
        >
          Pricing
        </NuxtLink>
        <NuxtLink
          href="/changelog"
          class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700"
        >
          Changelog
        </NuxtLink>
        <NuxtLink href="/docs" class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700">
          Documentation
        </NuxtLink>
      </div>

      <div class="w-full max-w-[250px]">
        <div class="mb-2 text-[13px] font-medium text-slate-700">Company</div>
        <NuxtLink href="/terms" class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700">
          Terms
        </NuxtLink>
        <NuxtLink
          href="/privacy"
          class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700"
        >
          Privacy
        </NuxtLink>
        <a
          href="mailto:support@pavrel.com"
          class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700"
        >
          Contact
        </a>
        <NuxtLink href="/login" class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700">
          Log in
        </NuxtLink>
        <NuxtLink
          href="/register"
          class="block cursor-pointer text-[13px] leading-7 text-slate-500 hover:text-slate-700"
        >
          Register
        </NuxtLink>
      </div>

      <div class="w-full max-w-[250px]">
        <div class="mb-2 text-[13px] font-medium text-slate-700">Community</div>
        <a
          href="https://join.slack.com/t/pavrelcommunity/shared_invite/zt-1t5h5g1tz-32KKfZL0QbEDIIpLsRMJTw"
          class="flex cursor-pointer items-center text-[13px] leading-7 text-slate-500 hover:text-slate-700"
          target="_blank"
        >
          <span>Slack</span> <ArrowUpRightIcon class="ml-0.5 h-4 w-4" />
        </a>
        <a
          href="https://twitter.com/usePavrel"
          class="flex cursor-pointer items-center text-[13px] leading-7 text-slate-500 hover:text-slate-700"
          target="_blank"
        >
          <span>Twitter</span> <ArrowUpRightIcon class="ml-0.5 h-4 w-4" />
        </a>
      </div>
    </div>
  </footer>

  <div class="absolute inset-0 -z-20 bg-repeat" style="background-image: url('/cube.svg'); background-size: 50px">
    <div class="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-100 via-slate-50"></div>
  </div>
</template>
