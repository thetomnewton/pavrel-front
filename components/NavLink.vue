<script>
export default {
  props: ['href', 'active'],
}
</script>

<template>
  <RouterLink :to="href">
    <div
      class="border-b-2 border-transparent pt-[6px] pb-2.5 transition duration-500"
      :class="{ 'border-blue-600 text-blue-600': active }"
    >
      <slot />
    </div>
  </RouterLink>
</template>
