<script setup lang="ts">
import { computed, ref } from 'vue'
import Switch from '../components/Switch.vue'
import { Workspace } from '../types'
import { priceValues, priceIds, productIds } from '../config/products'
import { clone } from 'lodash-es'
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  workspace: Workspace
  isMonthlyBilling: boolean
}>()

const config = useRuntimeConfig()

const billingFrequency = computed(() => (props.isMonthlyBilling ? 'monthly' : 'yearly'))

const proPrice = computed(() => priceValues[billingFrequency.value])

const prices = clone(priceIds)
const products = ref(productIds)

const { hasSubscription } = useSubscriptions()

interface Feature {
  name: string
  desc: string
  free: string
  pro: string
}

const usageFeatures = ref<Feature[]>([
  {
    name: 'Ideas',
    desc: '',
    free: '✓ 50',
    pro: '✓ Unlimited',
  },
  {
    name: 'Teams',
    desc: '',
    free: '✓ Unlimited',
    pro: '✓ Unlimited',
  },
  {
    name: 'Team members',
    desc: '',
    free: '✓ Unlimited',
    pro: '✓ Unlimited',
  },
  {
    name: 'Max upload file size',
    desc: '',
    free: '✓ 5mb',
    pro: '✓ Unlimited',
  },
  {
    name: 'Private teams',
    desc: '',
    free: '',
    pro: '✓',
  },
])

const collabFeatures = ref<Feature[]>([
  {
    name: 'Real time sync',
    desc: '',
    free: '✓',
    pro: '✓',
  },
  {
    name: 'Link sharing',
    desc: '',
    free: '✓',
    pro: '✓',
  },
])

const otherFeatures = ref<Feature[]>([
  {
    name: 'Version history',
    desc: '',
    free: '',
    pro: '30 days',
  },
  {
    name: 'Integrations',
    desc: '',
    free: '',
    pro: '✓',
  },
  {
    name: 'API',
    desc: '',
    free: '',
    pro: '✓',
  },
])

const supportFeatures = ref<Feature[]>([
  {
    name: 'Priority support',
    desc: '',
    free: '',
    pro: '✓',
  },
])
</script>

<template>
  <div class="grid min-w-[800px] grid-cols-3 gap-x-8">
    <div></div>

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
    </div>

    <div class="-ml-4 rounded-t bg-slate-50 px-4 pt-4 pb-4 dark:bg-zinc-800">
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
          class="block w-full cursor-default appearance-none rounded-md border border-transparent bg-blue-600 px-4 py-2 text-center text-sm font-medium leading-5 text-white hover:shadow active:translate-y-px active:bg-blue-700"
        >
          Upgrade now
        </a>

        <button
          v-else
          class="block w-full cursor-default appearance-none rounded-md border border-slate-200 px-4 py-2 leading-5 dark:border-zinc-700"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Usage</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>

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
    </template>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Collaboration</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>

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
    </template>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Features</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>

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
    </template>

    <div class="pt-6 pb-2 text-[15px] font-medium leading-6 text-slate-900">Support</div>
    <div></div>
    <div class="-mx-4 bg-slate-50 px-4 dark:bg-zinc-800"></div>

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
    </template>

    <div class="h-4"></div>
    <div></div>
    <div class="-mx-4 rounded-b bg-slate-50 dark:bg-zinc-800"></div>
    <div></div>
  </div>
</template>
