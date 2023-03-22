<script setup lang="ts">
definePageMeta({
  layout: 'settings',
})
</script>

<template>
  <div class="mx-auto max-w-4xl py-10 px-6 lg:px-8">
    <div class="mb-8 border-b border-slate-200 pb-8 dark:border-zinc-700">
      <div class="text-[22px] font-medium">Account settings</div>
    </div>

    <div>
      <UpdateProfileInformationForm />

      <SectionBorder />
    </div>

    <div>
      <UpdatePasswordForm class="mt-10 sm:mt-0" />
    </div>
  </div>
</template>
