<script setup lang="ts">
definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const route = useRoute()
const { getWorkspaceFromSlug } = useWorkspace()

const workspace = getWorkspaceFromSlug(route.params.workspaceSlug as string)

useHead({
  title: `Billing › ${workspace?.name}`,
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-6 py-10 lg:px-8">
    <div class="mb-8 border-b border-slate-200 pb-8 dark:border-zinc-700">
      <div class="text-[22px] font-medium">Billing</div>
    </div>

    <div>{{ workspace }}</div>
  </div>
</template>
