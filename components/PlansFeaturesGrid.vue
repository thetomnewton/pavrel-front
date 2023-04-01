<script setup lang="ts">
import { computed, ref } from 'vue'
import Switch from '../components/Switch.vue'
import { Workspace } from '../types'
import { priceValues, priceIds, productIds } from '../config/products'
import { clone } from 'lodash-es'
import { CheckIcon } from '@heroicons/vue/20/solid'

defineProps<{
  workspace: Workspace
}>()

const config = useRuntimeConfig()

const isMonthlyBilling = ref(false)
const billingFrequency = computed(() => (isMonthlyBilling.value ? 'monthly' : 'yearly'))

const proPrice = computed(() => priceValues[billingFrequency.value])

const prices = clone(priceIds)
const products = ref(productIds)

const { hasSubscription } = useSubscriptions()

interface Feature {
  name: string
  desc: string
  free: string
  pro: string
  enterprise: string
}

const usageFeatures = ref<Feature[]>([
  {
    name: 'Ideas',
    desc: '',
    free: '✓ 100',
    pro: '✓ Unlimited',
    enterprise: '✓ Unlimited',
  },
  {
    name: 'Team members',
    desc: '',
    free: '✓ Unlimited',
    pro: '✓ Unlimited',
    enterprise: '✓ Unlimited',
  },
  {
    name: 'Max upload file size',
    desc: '',
    free: '✓ 10mb',
    pro: '✓ Unlimited',
    enterprise: '✓ Unlimited',
  },
  {
    name: 'Private teams',
    desc: '',
    free: '',
    pro: '✓',
    enterprise: '✓',
  },
])

const collabFeatures = ref<Feature[]>([
  {
    name: 'Real time sync',
    desc: '',
    free: '✓',
    pro: '✓',
    enterprise: '✓',
  },
  {
    name: 'Link sharing',
    desc: '',
    free: '✓',
    pro: '✓',
    enterprise: '✓',
  },
])

const otherFeatures = ref<Feature[]>([
  {
    name: 'Version history',
    desc: '',
    free: '',
    pro: '30 days',
    enterprise: 'Unlimited',
  },
  {
    name: 'Integrations',
    desc: '',
    free: '',
    pro: '✓',
    enterprise: '✓',
  },
  {
    name: 'API',
    desc: '',
    free: '',
    pro: '✓',
    enterprise: '✓',
  },
])

const supportFeatures = ref<Feature[]>([
  {
    name: 'Priority support',
    desc: '',
    free: '',
    pro: '✓',
    enterprise: '✓',
  },
])
</script>

<template>
  <div class="grid min-w-[800px] grid-cols-4 gap-x-8">
    <div class="flex items-end pt-4">
      <div class="flex items-center text-[.8125rem] leading-[38px] text-slate-700 dark:text-zinc-400">
        <span class="cursor-default" @click="isMonthlyBilling = false"> Pay yearly </span>
        <Switch class="mx-2" v-model="isMonthlyBilling" :size="14" />
        <span class="cursor-default" @click="isMonthlyBilling = true">Monthly</span>
      </div>
    </div>

    <div class="pt-4">
      <div class="mb-2 flex items-center space-x-2 font-semibold">
        <div>Free</div>
        <div
          v-if="!hasSubscription(products.pro)"
          class="inline-flex items-center space-x-1 rounded bg-blue-200 px-1 py-px text-xs font-medium text-blue-800"
        >
          <CheckIcon class="h-[14px] w-[14px]" />
          <span>Current</span>
        </div>
      </div>
      <div class="mb-4">
        <span class="mr-1 text-2xl font-medium">$0</span>
        <span class="text-[.8125rem] text-slate-700 dark:text-zinc-400">per user / month</span>
      </div>
      <div>
        <button
          type="button"
          v-if="hasSubscription(products.pro)"
          class="w-full appearance-none rounded-md border px-4 py-2 text-sm leading-5 disabled:pointer-events-none disabled:opacity-70"
        >
          Downgrade
        </button>
      </div>
    </div>

    <div class="-mx-4 rounded-t bg-slate-50 px-4 pt-4 pb-4 dark:bg-zinc-800">
      <div class="mb-2 flex items-center font-semibold">
        <span>Pro</span>
        <span v-if="!isMonthlyBilling" class="ml-2 rounded bg-green-200 px-1 py-px text-xs font-medium text-green-800"
          >-20%</span
        >
        <div
          v-if="hasSubscription(products.pro)"
          class="ml-2 inline-flex items-center space-x-1 rounded bg-blue-200 px-1 py-px text-xs font-medium text-blue-800"
        >
          <CheckIcon class="h-[14px] w-[14px]" />
          <span>Current</span>
        </div>
      </div>

      <div class="mb-4">
        <span class="mr-1 text-2xl font-medium">${{ proPrice }}</span>
        <span class="text-[.8125rem] text-slate-700 dark:text-zinc-400">per user / month</span>
      </div>

      <div>
        <a
          v-if="!hasSubscription(products.pro)"
          :href="`${config.public.backendUrl}/workspaces/${workspace.id}/subscribe/${products.pro}/${prices[billingFrequency]}`"
          type="button"
          class="block w-full appearance-none rounded-md border border-transparent bg-blue-600 px-4 py-2 text-center text-sm font-medium leading-5 text-white hover:shadow active:translate-y-px active:bg-blue-700"
        >
          Upgrade now
        </a>
      </div>
    </div>

    <div class="pt-4">
      <div class="mb-2 font-semibold">Enterprise</div>
      <div class="mb-4 text-xl leading-8">Contact us</div>
      <div>
        <button
          type="button"
          class="block w-full appearance-none rounded-md border border-transparent bg-blue-600 px-4 py-2 text-center text-sm font-medium leading-5 text-white hover:shadow active:translate-y-px active:bg-blue-700"
        >
          Contact us
        </button>
      </div>
    </div>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Usage</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>
    <div></div>

    <template v-for="feature in usageFeatures" :key="feature.name">
      <div>
        <div class="text-sm leading-10 text-slate-700 dark:text-zinc-400">{{ feature.name }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.free }}</div>
      </div>

      <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800">
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.pro }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.enterprise }}</div>
      </div>
    </template>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Collaboration</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>
    <div></div>

    <template v-for="feature in collabFeatures" :key="feature.name">
      <div>
        <div class="text-sm leading-10 text-slate-700 dark:text-zinc-400">{{ feature.name }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.free }}</div>
      </div>

      <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800">
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.pro }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.enterprise }}</div>
      </div>
    </template>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Features</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>
    <div></div>

    <template v-for="feature in otherFeatures" :key="feature.name">
      <div>
        <div class="text-sm leading-10 text-slate-700 dark:text-zinc-400">{{ feature.name }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.free }}</div>
      </div>

      <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800">
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.pro }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.enterprise }}</div>
      </div>
    </template>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Support</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>
    <div></div>

    <template v-for="feature in supportFeatures" :key="feature.name">
      <div>
        <div class="text-sm leading-10 text-slate-700 dark:text-zinc-400">{{ feature.name }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.free }}</div>
      </div>

      <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800">
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.pro }}</div>
      </div>

      <div>
        <div class="text-sm leading-10 text-slate-900 dark:text-zinc-300">{{ feature.enterprise }}</div>
      </div>
    </template>

    <div class="h-4"></div>
    <div></div>
    <div class="-mx-4 rounded-b bg-slate-50 dark:bg-zinc-800"></div>
    <div></div>
  </div>
</template>
