<script>
import JetSectionTitle from './SectionTitle.vue'

export default {
  components: {
    JetSectionTitle,
  },
}
</script>

<template>
  <div class="md:flex">
    <jet-section-title>
      <template #title><slot name="title" /></template>
      <template #description><slot name="description" /></template>
    </jet-section-title>

    <div class="mt-5 md:mt-0 md:flex-1">
      <slot name="content" />
    </div>
  </div>
</template>
