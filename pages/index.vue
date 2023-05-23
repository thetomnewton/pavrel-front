<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
  middleware: 'guest',
})

useHead({
  title: 'Pavrel',
  meta: [{ name: 'description', content: 'Unleash your creativity. Pavrel is a home for your ideas.' }],
  bodyAttrs: {
    class: 'bg-slate-50 antialiased font-sans',
  },
})

const billingStrategy = ref<'yearly' | 'monthly'>('yearly')
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 pt-20 pb-20 text-center sm:pt-24 lg:px-8">
    <h1 class="mb-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
      Idea management for modern software teams
    </h1>

    <p class="leading-6 text-slate-700">
      <span class="font-semibold text-slate-700">Before Pavrel</span>: Ideas are scattered, backlog feels
      insurmountable, unclear how to go from from "idea" to "planned out and ready for work".
      <span class="font-semibold text-slate-700">After Pavrel</span>: Ideas captured in a central, searchable,
      collaborative place, you feel in control of your backlog again with less overwhelm and less stress.
    </p>

    <div class="mt-8">
      <NuxtLink
        to="/register"
        class="inline-block rounded-lg border border-blue-600 bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-1.5 text-base font-semibold leading-7 text-white shadow-md outline-none ring-0 ring-blue-600 transition-all hover:bg-blue-700 hover:ring-blue-700 focus:ring-2 focus:ring-offset-2 active:translate-y-px active:from-blue-700"
      >
        Get started free
      </NuxtLink>
    </div>

    <div class="mt-3 text-xs text-slate-500">No credit card required.</div>
  </section>

  <section class="mx-auto hidden max-w-[1249px] py-8 px-6 lg:block lg:py-12 lg:px-8">
    <div class="rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 p-1 shadow-md">
      <img src="/app-ss1.png" class="rounded-[6px]" />
    </div>
  </section>

  <section class="mx-auto flex flex-wrap justify-center gap-6 px-6 pt-20 pb-20 lg:px-8" id="features">
    <div class="w-full rounded-2xl border border-slate-200 bg-white shadow-sm md:w-[450px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="background-image: url('/marketing/list-view.png'); background-position-x: -8px; background-size: 500px"
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-white"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Organize</div>
        <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">
          Free your backlog from "maybe one day" tasks
        </div>
        <div class="text-[15px] font-medium text-slate-500">
          Reduce clutter and allow your team to focus on what really matters.
        </div>
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white shadow-sm md:w-[450px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="
            background-image: url('/marketing/quick-capture.png');
            background-position-x: -35px;
            background-position-y: -70px;
            background-size: 500px;
          "
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-white"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Create</div>
        <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">Stimulate creativity & innovation</div>
        <div class="text-[15px] font-medium text-slate-500">
          Capture ideas as they arise, without worrying if they are fully formed yet or thought-through.
        </div>
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white shadow-sm md:w-[450px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="
            background-image: url('/marketing/create-team.png');
            background-position-x: 0px;
            background-position-y: 0px;
            background-size: 500px;
          "
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-white"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Collaborate</div>
        <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">
          Ideate and perfect solutions in context
        </div>
        <div class="text-[15px] font-medium text-slate-500">
          Pavrel's teams functionality allows you to share and collaborate on ideas with the right people.
        </div>
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white shadow-sm md:w-[450px]">
      <div class="relative flex h-[300px]">
        <div
          class="h-full w-full rounded-t-2xl"
          style="
            background-image: url('/marketing/drag-drop.png');
            background-position-x: -50px;
            background-position-y: -90px;
            background-size: 500px;
          "
        ></div>
        <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-white"></div>
      </div>

      <div class="px-10 pb-8 pt-4">
        <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Focus</div>
        <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">
          Everything you need, right at your fingertips
        </div>
        <div class="text-[15px] font-medium text-slate-500">
          Your team will love the crisp and modern interface, with blazing fast interactions and real-time sync.
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl py-16 px-6 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:py-24">
    <div>
      <h2 class="text-base font-medium text-blue-600">Manage ideas like a pro</h2>
      <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        Delightfully simple, deceptively powerful.
      </p>
      <p class="mt-4 text-lg text-slate-500">
        Allow your team to capture, organize, collaborate, and focus with Pavrel.
      </p>
    </div>
    <div class="mt-12 lg:col-span-2 lg:mt-0">
      <dl
        class="space-y-10 sm:grid sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-4 sm:gap-x-6 sm:gap-y-10 sm:space-y-0 lg:gap-x-8"
      >
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Blazing fast</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Built for speed and productivity, with most interactions feeling instantaneous.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Searchable archive</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Easily find and connect ideas throughout your workspace's lifespan.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Collaborate with your team</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Pavrel is perfect for both solo projects and large teams or projects.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Keyboard shortcuts</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Supercharge your productivity - your team will love using Pavrel.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Real-time sync</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Updates are shared between your team in real-time. No refreshing required.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Shared &amp; private boards</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Collaborate on upcoming work, or brainstorm before unveiling them to your team.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Advanced filters</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Find exactly what you need with advanced filters and bulk actions.
          </dd>
        </div>
        <div class="relative">
          <dt>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="absolute h-6 w-6 text-green-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <p class="ml-9 text-lg font-medium leading-6 text-slate-900">Notifications</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-slate-500">
            Everyone stays in the loop with intelligent notifications and subscriptions.
          </dd>
        </div>
      </dl>
    </div>
  </section>

  <section id="pricing" class="bg-white py-24 px-4 sm:px-6 lg:px-8">
    <div class="sm:align-center mx-auto max-w-7xl sm:flex sm:flex-col">
      <h1 class="text-4xl font-semibold tracking-tight text-slate-900 sm:text-center">Pricing plans</h1>

      <p class="mt-5 text-lg text-slate-500 sm:text-center">
        Start building for free, then upgrade to get even more done with Pavrel.
      </p>

      <div class="relative mt-6 flex self-center rounded-lg bg-slate-100 p-0.5 sm:mt-8">
        <button
          type="button"
          class="relative w-1/2 whitespace-nowrap rounded-md py-2 text-sm font-medium text-slate-900 shadow-sm focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8"
          @click="billingStrategy = 'yearly'"
          :class="[billingStrategy === 'yearly' ? 'border-slate-200 bg-white shadow-sm' : 'border-transparent']"
        >
          Yearly billing
        </button>

        <button
          type="button"
          class="relative ml-0.5 w-1/2 whitespace-nowrap rounded-md py-2 text-sm font-medium text-slate-900 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8"
          @click="billingStrategy = 'monthly'"
          :class="[billingStrategy === 'monthly' ? 'border-slate-200 bg-white shadow-sm' : 'border-transparent']"
        >
          Monthly billing
        </button>
      </div>

      <div class="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl">
        <div class="flex flex-col rounded-xl border border-slate-200 shadow-sm">
          <div class="p-6">
            <h2 class="flex items-center text-lg font-medium leading-6 text-slate-900"><span>Free</span></h2>
            <p class="mt-4 text-sm text-slate-500">Get your whole team using Pavrel, completely free</p>
            <p class="mt-8">
              <span class="text-4xl font-bold tracking-tight text-slate-900">$0</span>
            </p>
            <NuxtLink
              to="/register"
              class="mt-8 block w-full rounded-md border border-blue-600 bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign up for free
            </NuxtLink>
          </div>
          <div class="mx-6 mb-6 flex-1 rounded-[8px] bg-slate-50 p-6">
            <h3 class="text-sm font-medium text-slate-900">What's included</h3>
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
                <span class="text-sm text-slate-600">100 ideas</span>
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
                <span class="text-sm text-slate-600">Unlimited teams</span>
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
                <span class="text-sm text-slate-600">Unlimited team members</span>
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
                <span class="text-sm text-slate-600">Unlimited workspaces</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col rounded-xl border border-slate-200 shadow-sm">
          <div class="p-6">
            <h2 class="flex items-center text-lg font-medium leading-6 text-slate-900">
              <span>Pro</span>
              <span
                v-if="billingStrategy === 'yearly'"
                class="ml-auto cursor-default rounded bg-green-200 px-1.5 py-0.5 text-sm leading-5 text-green-800"
              >
                -20%
              </span>
            </h2>
            <p class="mt-4 text-sm text-slate-500">Take your company to the next level with Pavrel Pro</p>
            <p class="mt-8">
              <span class="text-4xl font-bold tracking-tight text-slate-900">
                {{ billingStrategy === 'monthly' ? '$10' : '$96' }}
              </span>
              <span class="text-base font-medium text-slate-500"
                >/user/{{ billingStrategy === 'monthly' ? 'month' : 'year' }}</span
              >
            </p>
            <NuxtLink
              to="/login"
              class="mt-8 block w-full rounded-md border border-blue-600 bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Buy Pro
            </NuxtLink>
          </div>

          <div class="mx-6 mb-6 flex-1 rounded-[8px] bg-slate-50 p-6">
            <h3 class="text-sm font-medium text-slate-900">What's included</h3>
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
                <span class="text-sm text-slate-600">Everything in Free</span>
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
                <span class="text-sm text-slate-600">Unlimited workspaces</span>
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
                <span class="text-sm text-slate-600">Private teams</span>
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
                <span class="text-sm text-slate-600">30 days version history</span>
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
                <span class="text-sm text-slate-600">API + integrations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
