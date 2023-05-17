<script setup lang="ts">
import { ref } from 'vue'
import { productIds } from '../../../config/products'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const route = useRoute()
const { getWorkspaceFromSlug } = useWorkspace()
const { hasSubscription } = useSubscriptions()

const products = ref(productIds)

const workspace = getWorkspaceFromSlug(route.params.workspaceSlug as string)

useHead({
  title: `Plans & Upgrade › ${workspace?.name}`,
})

const isMonthlyBilling = ref(false)
const billingFrequency = computed(() => (isMonthlyBilling.value ? 'monthly' : 'yearly'))
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-10 lg:px-8" v-if="workspace">
    <div class="mb-8 border-b border-slate-200 pb-4 dark:border-zinc-700">
      <div class="text-[22px] font-medium">Plans & Upgrade</div>

      <p class="mt-4 text-sm text-slate-700 dark:text-zinc-400">
        This workspace is currently on the
        <span class="font-medium text-slate-800 dark:text-zinc-300">
          {{ hasSubscription(products.pro) ? 'Pro' : 'Free' }}
        </span>
        plan. Upgrade to do even more with Pavrel.
      </p>

      <p class="mt-2 flex">
        <span class="flex items-end pt-4">
          <span class="flex items-center text-sm font-medium leading-[38px] text-slate-600 dark:text-zinc-400">
            <span class="cursor-default" @click="isMonthlyBilling = false"> Pay annually </span>
            <Switch class="mx-2" v-model="isMonthlyBilling" :size="20" />
            <span class="cursor-default" @click="isMonthlyBilling = true">Monthly</span>
          </span>
        </span>
      </p>
    </div>

    <div class="w-full overflow-x-auto pb-12">
      <PlansFeaturesGrid :workspace="workspace" :is-monthly-billing="isMonthlyBilling" />
    </div>
  </div>
</template>
