<script>
export default {
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
}
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 active:bg-slate-50 active:text-slate-800 disabled:opacity-25 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:active:border-blue-500 dark:active:bg-zinc-800 dark:active:text-zinc-300"
  >
    <slot></slot>
  </button>
</template>
