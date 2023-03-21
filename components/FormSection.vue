<script>
import JetSectionTitle from './SectionTitle.vue'

export default {
  emits: ['submitted'],

  components: {
    JetSectionTitle,
  },

  computed: {
    hasActions() {
      return !!this.$slots.actions
    },
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
      <form @submit.prevent="$emit('submitted')">
        <div class="grid grid-cols-6 gap-6">
          <slot name="form" />
        </div>

        <div v-if="hasActions" class="mt-6">
          <slot name="actions" />
        </div>
      </form>
    </div>
  </div>
</template>
