<script>
export default {
  props: ['active', 'href', 'as'],

  computed: {
    classes() {
      return this.active
        ? 'block pl-3 pr-4 py-2 border-l-4 border-indigo-400 text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition'
        : 'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:text-slate-800 focus:bg-slate-50 focus:border-slate-300 transition'
    },
  },
}
</script>

<template>
  <div>
    <button :class="classes" class="w-full text-left" v-if="as == 'button'">
      <slot />
    </button>

    <RouterLink :to="href" :class="classes" v-else>
      <slot />
    </RouterLink>
  </div>
</template>
