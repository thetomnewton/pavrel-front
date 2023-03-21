<template>
  <div class="flex justify-between md:mr-6 md:w-1/3">
    <div class="px-4 sm:px-0">
      <h3 class="text-lg font-medium text-slate-900 dark:text-zinc-200">
        <slot name="title" />
      </h3>

      <p class="mt-1 text-sm text-slate-600 dark:text-zinc-400">
        <slot name="description" />
      </p>
    </div>

    <div class="px-4 sm:px-0">
      <slot name="aside" />
    </div>
  </div>
</template>
