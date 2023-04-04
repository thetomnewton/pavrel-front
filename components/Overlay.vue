<script setup lang="ts">
defineProps<{
  error: boolean
}>()

const { logout } = useLogout()

function retry() {
  location.reload()
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900">
    <div class="mb-12">
      <LogoColor class="mx-auto mb-6 h-12 w-16" />

      <template v-if="!error">
        <div
          class="spinner mx-auto h-5 w-5 rounded-full border-2 border-blue-200 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-600"
        ></div>
      </template>

      <template v-else>
        <div>
          <div class="mb-2 text-center text-lg font-medium">Something went wrong</div>
          <div class="mb-5 text-center text-slate-500 dark:text-zinc-400">
            There was an error loading your workspace content.
          </div>

          <div class="text-center">
            <Button type="button" @click="retry" class="mr-3 cursor-default"> Try again </Button>

            <button
              type="button"
              @click="logout"
              class="ml-3 cursor-default appearance-none rounded-md border border-slate-200 py-2 px-4 text-sm font-medium leading-5 text-slate-800 shadow-sm hover:border-slate-300 active:bg-slate-50 active:shadow-none dark:border-zinc-700 dark:text-zinc-300 dark:active:bg-zinc-800"
            >
              Log out
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
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

.spinner {
  animation: spin 1s linear infinite;
}
</style>
