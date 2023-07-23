<script setup lang="ts">
import { CloudIcon, CodeBracketIcon, FireIcon, HeartIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'marketing',
  middleware: 'guest',
})

useHead({
  title: 'Pavrel',
  meta: [{ name: 'description', content: 'Unleash your creativity. Pavrel is a home for your ideas.' }],
  bodyAttrs: {
    class: 'bg-zinc-900 antialiased font-sans',
  },
})

const billingStrategy = ref<'yearly' | 'monthly'>('yearly')
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 pb-20 pt-20 text-center sm:pt-24 lg:px-8">
    <h1 class="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">A home for your team's ideas</h1>

    <p class="text-xl leading-7 text-zinc-300">
      <span class="font-semibold text-zinc-100">Take control</span> of your workflow and
      <span class="font-semibold text-zinc-100">foster an innovation culture</span> in your team with Pavrel.
    </p>

    <div class="mt-8">
      <NuxtLink
        to="/register"
        class="inline-block rounded-lg border border-blue-600 bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-1.5 text-base font-semibold leading-7 text-white shadow-md outline-none ring-0 ring-blue-600 transition-all hover:bg-blue-700 hover:ring-blue-700 focus:ring-2 focus:ring-offset-2 active:translate-y-px active:from-blue-700"
      >
        Get started free
      </NuxtLink>
    </div>

    <div class="mt-3 text-xs text-zinc-300">No credit card required.</div>
  </section>

  <section class="mx-auto hidden max-w-[1249px] px-6 py-10 lg:block lg:px-8">
    <div class="rounded-lg bg-gradient-to-r from-zinc-700 to-zinc-700 p-[2px]">
      <img src="/app-ss1-dark.png" class="rounded-[6px]" />
    </div>
  </section>

  <section class="mx-auto max-w-3xl px-6 py-16 text-lg leading-7 text-white lg:px-8">
    <h2 class="mb-8 text-2xl font-medium">Does this sound familiar?</h2>

    <p class="mb-6">
      Through building products over the last decade and speaking to countless software teams, we've seen the same
      frustrations appearing.
    </p>

    <ul class="pl-5">
      <li class="mb-4 list-disc pl-3">
        Ideas for new features or improvements from team members are
        <span class="font-semibold">scattered</span> across different platforms or mediums, or get lost or forgotten.
      </li>

      <li class="mb-4 list-disc pl-3">
        Your <span class="font-semibold">backlog is growing</span> faster than work can be completed, and it contains a
        mixture of "planned out, thought-through" type work as well as "maybe one day" type work.
      </li>

      <li class="mb-4 list-disc pl-3">
        A lot of <span class="font-semibold">good ideas don't make it</span> to the "planned out and ready for work"
        stage.
      </li>

      <li class="list-disc pl-3">
        You'd <span class="font-semibold">like to foster more of an innovation culture</span> in your team.
      </li>
    </ul>

    <p class="mt-6">
      We found ourselves having these exact issues, and when we learned that others had the same frustrations, we built
      Pavrel as the solution we wish we had years ago.
    </p>

    <p class="mt-6">We're proud of it, and we hope you like it.</p>
  </section>

  <section class="mx-auto flex flex-wrap justify-center gap-6 px-6 pb-20 pt-20 leading-7 lg:px-8" id="features">
    <div class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 shadow-sm md:w-[400px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="
            background-image: url('/marketing/list-view-dark.png');
            background-position-x: -8px;
            background-size: 500px;
          "
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-zinc-900"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-base font-medium text-blue-500">Organize</div>
        <div class="mb-3 text-[20px] font-medium text-zinc-100">Free your backlog from "maybe one day" tasks</div>
        <div class="text-zinc-400">
          Keep your backlog from feeling overwhelming, and save it for only committed and planned-out work.
        </div>
      </div>
    </div>

    <div class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 shadow-sm md:w-[400px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="
            background-image: url('/marketing/quick-capture-dark.png');
            background-position-x: -35px;
            background-position-y: -70px;
            background-size: 500px;
          "
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-zinc-900"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-base font-medium text-blue-500">Create</div>
        <div class="mb-3 text-[20px] font-medium text-zinc-100">Capture now, shape later</div>
        <div class="text-zinc-400">
          Capture ideas as they arise, without worrying if they are fully formed yet or thought-through.
        </div>
      </div>
    </div>

    <div class="w-full rounded-2xl border border-zinc-700 bg-zinc-900 shadow-sm md:w-[400px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="
            background-image: url('/marketing/create-team-dark.png');
            background-position-x: 0px;
            background-position-y: 0px;
            background-size: 500px;
          "
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-zinc-900"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-base font-medium text-blue-500">Collaborate</div>
        <div class="mb-3 text-[20px] font-medium text-zinc-100">Ideate and perfect solutions in context</div>
        <div class="text-zinc-400">
          Pavrel's teams functionality allows you to share and collaborate on ideas with the right people.
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto flex max-w-5xl flex-col items-center gap-y-24 px-6 py-16 lg:flex-row lg:px-8" id="overview">
    <div class="mr-6 text-zinc-100 lg:w-1/2">
      <h2 class="mb-8 text-2xl font-[450]">Built for modern software teams</h2>

      <div class="mb-8 flex items-start">
        <span class="mr-4">
          <FireIcon class="h-7 w-6 text-orange-600" />
        </span>

        <span class="flex flex-1 flex-col">
          <span class="mb-2 text-lg font-[450] text-zinc-100">Blazing fast with real-time sync</span>
          <span class="leading-7 text-zinc-400">
            Collaborate on ideas in real-time with your team, and see updates reflected immediately.
          </span>
        </span>
      </div>

      <div class="mb-8 flex items-start">
        <span class="mr-4">
          <CloudIcon class="fill h-7 w-6 text-blue-500" />
        </span>

        <span class="flex flex-1 flex-col">
          <span class="mb-2 text-lg font-[450] text-zinc-100">Works offline</span>
          <span class="leading-7 text-zinc-400">
            Capture ideas wherever you are, across all your devices, then sync up with your team when your connection
            returns.
          </span>
        </span>
      </div>

      <div class="flex items-start">
        <span class="mr-4">
          <CodeBracketIcon class="h-7 w-6 text-zinc-300" />
        </span>

        <span class="flex flex-1 flex-col">
          <span class="mb-2 text-lg font-[450] text-zinc-100">Designed with precision</span>
          <span class="leading-7 text-zinc-400">Your team will enjoy Pavrel's crisp and elegant interface.</span>
        </span>
      </div>
    </div>

    <div class="max-w-[550px] rounded-2xl border border-zinc-600 bg-zinc-800 shadow-xl lg:w-1/2 lg:max-w-none">
      <div class="relative">
        <div
          class="min-h-[400px] rounded-t-2xl bg-cover"
          style="background-image: url('/marketing/drag-drop-dark.png'); background-position: top left"
        ></div>
        <div class="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-zinc-800"></div>
      </div>

      <div class="mb-20 mt-6 px-10 pt-6 text-zinc-100">
        <h4 class="flex items-center text-xl font-[450]">
          <HeartIcon class="-ml-0.5 mr-2 h-6 w-6 text-blue-500" /> Loved by hundreds of teams
        </h4>

        <p class="mt-3 leading-7 text-zinc-300">
          Our customers love the way Pavrel is accelerating their work. Feel free to join our
          <a
            href="https://join.slack.com/t/pavrelcommunity/shared_invite/zt-1t5h5g1tz-32KKfZL0QbEDIIpLsRMJTw"
            target="_blank"
            class="font-[450] text-zinc-100 underline"
            >Slack</a
          >
          community to see how teams are using Pavrel.
        </p>
      </div>
    </div>
  </section>

  <section id="pricing" class="bg-zinc-900 px-6 py-24 lg:px-8">
    <div class="sm:align-center mx-auto max-w-7xl sm:flex sm:flex-col">
      <h2 class="text-2xl font-[450] text-zinc-100 sm:text-center">Choose a plan</h2>

      <p class="mt-4 text-lg text-zinc-300 sm:text-center">
        Start building for free, then upgrade to get even more done with Pavrel.
      </p>

      <div class="relative mt-6 flex self-center rounded-[10px] bg-zinc-700 p-0.5 sm:mt-8">
        <button
          type="button"
          class="relative w-1/2 whitespace-nowrap rounded-lg py-2 text-sm font-medium text-zinc-100 shadow-sm focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:w-auto sm:px-8"
          @click="billingStrategy = 'yearly'"
          :class="[billingStrategy === 'yearly' ? 'border-zinc-200 bg-zinc-500 shadow-sm' : 'border-transparent']"
        >
          Yearly billing
        </button>

        <button
          type="button"
          class="relative ml-0.5 w-1/2 whitespace-nowrap rounded-lg py-2 text-sm font-medium text-zinc-100 focus:z-10 focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:w-auto sm:px-8"
          @click="billingStrategy = 'monthly'"
          :class="[billingStrategy === 'monthly' ? 'border-zinc-200 bg-zinc-500 shadow-sm' : 'border-transparent']"
        >
          Monthly billing
        </button>
      </div>

      <div class="mt-12 space-y-6 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl">
        <div class="flex flex-col rounded-xl border border-zinc-600 shadow-sm">
          <div class="px-8 py-8">
            <h2 class="flex items-center text-lg font-medium leading-6 text-zinc-100"><span>Free</span></h2>
            <p class="mt-4 text-zinc-300">Get your whole team on board and trial Pavrel</p>
            <p class="mt-5">
              <span class="text-4xl font-semibold tracking-tight text-white">$0</span>
            </p>
            <NuxtLink
              to="/register"
              class="mt-8 block w-full rounded-md border border-blue-600 bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get started free
            </NuxtLink>
          </div>

          <div class="mx-8 mb-8 flex-1 rounded-[8px] bg-zinc-800 p-6">
            <h3 class="text-sm font-medium text-zinc-200">What's included</h3>

            <ul role="list" class="mt-6 space-y-4">
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">50 ideas</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Unlimited teams</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Unlimited team members</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Unlimited workspaces</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col rounded-xl border border-zinc-600 shadow-sm">
          <div class="px-8 py-8">
            <h2 class="flex items-center text-lg font-medium leading-6 text-zinc-100">
              <span>Pro</span>
              <span
                v-if="billingStrategy === 'yearly'"
                class="ml-auto cursor-default rounded bg-green-200 px-1.5 py-0.5 text-sm leading-5 text-green-900"
              >
                -20%
              </span>
            </h2>

            <p class="mt-4 text-zinc-300">Take your company to the next level with Pro</p>
            <p class="mt-5">
              <span class="text-4xl font-semibold tracking-tight text-white">
                {{ billingStrategy === 'monthly' ? '$10' : '$96' }}
              </span>
              <span class="text-base font-medium text-zinc-300">
                /user/{{ billingStrategy === 'monthly' ? 'month' : 'year' }}
              </span>
            </p>
            <NuxtLink
              to="/login"
              class="mt-8 block w-full rounded-md border border-blue-600 bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get Pavrel Pro
            </NuxtLink>
          </div>

          <div class="mx-8 mb-8 flex-1 rounded-[8px] bg-zinc-800 p-6">
            <h3 class="text-sm font-medium text-zinc-200">What's included</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Everything in Free</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Unlimited ideas</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Private teams</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">Version history (soon)</span>
              </li>

              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 flex-shrink-0 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-sm text-zinc-200">API + integrations (soon)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
