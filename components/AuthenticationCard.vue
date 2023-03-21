<template>
  <div class="h-screen overflow-auto py-6 dark:bg-zinc-900 sm:px-6">
    <div class="mx-auto w-full px-4 sm:max-w-sm">
      <div class="mb-6 mt-12 flex justify-center">
        <slot name="logo" />
      </div>

      <slot name="header" />

      <div>
        <slot />
      </div>
    </div>
  </div>
</template>
