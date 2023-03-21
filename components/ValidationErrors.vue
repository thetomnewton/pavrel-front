<script setup lang="ts">
const props = defineProps<{
  error: { errors: string[] }
}>()

const hasErrors = computed(() => Object.keys(props.error).length > 0)
</script>

<template>
  <Alert color="red" v-if="hasErrors">
    <div class="font-medium">The given data was invalid</div>

    <ul>
      <template v-for="errorsList in error.errors">
        <li v-for="error in errorsList" :key="error">{{ error }}</li>
      </template>
    </ul>
  </Alert>
</template>
