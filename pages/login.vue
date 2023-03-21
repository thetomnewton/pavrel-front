<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <section class="mx-auto w-full px-4 sm:max-w-sm">
    <div class="mb-6 mt-12 flex justify-center">
      <AuthenticationCardLogo />
    </div>

    <div class="mb-6 text-center">
      <h1 class="mb-1 text-2xl font-semibold text-slate-800 dark:text-zinc-200">Log in</h1>

      <NuxtLink
        to="/register"
        class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
      >
        Don't have an account? Sign up
      </NuxtLink>
    </div>

    <div>
      <ContinueWithGoogleLink />
    </div>

    <OrBadge />
  </section>
</template>
