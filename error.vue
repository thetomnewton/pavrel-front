<script setup lang="ts">
defineProps<{
  error: { statusCode: number }
}>()
</script>

<template>
  <div v-if="error.statusCode === 401">
    <div>Unauthorized</div>
  </div>

  <div v-else-if="error.statusCode === 403">
    <div>Forbidden</div>
  </div>

  <div v-else-if="error.statusCode === 404">
    <div>Page not found</div>
  </div>

  <div v-else-if="error.statusCode >= 500">
    <div>Something went wrong</div>
  </div>
</template>
