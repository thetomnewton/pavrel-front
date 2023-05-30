<script setup lang="ts">
import { ref } from 'vue'
import { productIds } from '../../../config/products'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
})

const route = useRoute()
const { getWorkspaceFromSlug } = useWorkspace()
const { hasActiveSubscription, subscriptionIsEnding } = useSubscriptions()

const products = ref(productIds)

const workspace = getWorkspaceFromSlug(route.params.workspaceSlug as string)

useHead({
  title: `Plans & Upgrade › ${workspace?.name}`,
})

const isAnnualBilling = ref(true)
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-10 lg:px-8" v-if="workspace">
    <div class="mb-8 border-b border-slate-200 pb-4 dark:border-zinc-700">
      <div class="text-[22px] font-medium">Plans & Upgrade</div>

      <p class="mt-4 text-sm text-slate-700 dark:text-zinc-400">
        This workspace is currently on the
        <span class="font-medium text-slate-800 dark:text-zinc-300">
          {{ hasActiveSubscription(products.pro) ? 'Pro' : 'Free' }}
        </span>
        plan.<template v-if="!hasActiveSubscription(products.pro)"> Upgrade to do even more with Pavrel.</template>
      </p>

      <p class="mt-4 text-sm text-slate-700 dark:text-zinc-400" v-if="subscriptionIsEnding(products.pro)">
        Your subscription has been cancelled and is due to expire soon. To avoid losing access to Pro features, set up a
        new subscription.
      </p>

      <p class="mt-2 flex">
        <span class="flex items-end pt-4">
          <span class="flex items-center text-sm font-medium leading-[38px] text-slate-600 dark:text-zinc-400">
            <span class="cursor-default" @click="isAnnualBilling = false"> Pay monthly </span>
            <Switch class="mx-3" v-model="isAnnualBilling" :size="20" />
            <span class="inline-flex cursor-default items-center" @click="isAnnualBilling = true">
              <span>Pay yearly</span>
              <span class="ml-1.5 rounded bg-green-200 px-1 py-px text-xs font-medium text-green-800">-20%</span>
            </span>
          </span>
        </span>
      </p>
    </div>

    <div class="w-full overflow-x-auto pb-12">
      <div class="border-b border-slate-200 pb-12 dark:border-zinc-700">
        <PlansFeaturesGrid :workspace="workspace" :is-monthly-billing="!isAnnualBilling" />

        <div class="mt-8 flex items-center text-[13px]">
          <img src="/climate.svg" alt="" class="w-6" />
          <span class="ml-2">
            Pavrel contributes 1% of your subscription to help remove CO₂ from the atmosphere through
            <a href="https://climate.stripe.com/ClSXsZ" class="text-blue-600 underline" target="_blank" rel="noreferrer"
              >Stripe Climate</a
            >.
          </span>
        </div>
      </div>

      <div class="mt-12 text-slate-900 dark:text-zinc-300">
        <h2 class="mb-4 text-2xl font-bold">FAQs</h2>

        <h4 class="font-semibold">Will my whole workspace be upgraded?</h4>
        <p class="mb-4">
          Yes, your whole workspace and everyone inside it will instantly gain access to the Pro features.
        </p>

        <h4 class="font-semibold">Can I cancel at any time?</h4>
        <p class="mb-4">
          Yes, you can cancel your subscription at any time by returning this page and selecting the option.
        </p>

        <h4 class="font-semibold">What happens if I add someone to my existing plan?</h4>
        <p class="mb-4">
          Your subscription will be updated accordingly for your next billing cycle. There may also be a pro-rated
          charge for usage of that additional person in your current billing cycle.
        </p>

        <h4 class="font-semibold">Can I contact you with additional questions?</h4>
        <p class="mb-4">
          Absolutely, please email
          <a href="mailto:support@pavrel.com" class="font-medium underline">support@pavrel.com</a> with any additional
          questions.
        </p>

        <h4 class="font-semibold">Do you offer enterprise plans?</h4>
        <p class="mb-4">Yes, please contact us to discuss.</p>
      </div>
    </div>
  </div>
</template>
