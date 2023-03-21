<template>
  <div class="loading-spinner inline-block h-4 w-4 rounded-full align-middle"></div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
}
</style>
