<script>
export default {
  props: ['href', 'as'],
}
</script>

<template>
  <div>
    <button
      type="submit"
      class="block w-full cursor-default appearance-none px-4 py-[6px] text-left text-[.8125rem] font-normal leading-5 text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
      v-if="as == 'button'"
    >
      <slot />
    </button>

    <a
      :href="href"
      class="block cursor-default px-4 py-[6px] text-[.8125rem] leading-5 text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
      v-else-if="as == 'a'"
    >
      <slot />
    </a>

    <RouterLink
      :to="href"
      class="block cursor-default px-4 py-[6px] text-[.8125rem] leading-5 text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
      v-else
    >
      <slot />
    </RouterLink>
  </div>
</template>
