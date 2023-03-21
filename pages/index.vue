<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})

useHead({
  title: 'Pavrel',
  meta: [{ name: 'description', content: 'Unleash your creativity. Pavrel is a home for your ideas.' }],
  bodyAttrs: {
    class: 'bg-slate-50 antialiased font-sans',
  },
})
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 pt-20 pb-20 sm:pt-24 lg:px-8">
    <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Unleash your creativity.</h1>
    <p class="mt-3 text-lg font-medium leading-8 text-slate-500">
      Pavrel is a home for your ideas. Designed for modern software teams.
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

  <section class="mx-auto flex flex-wrap justify-center gap-6 px-6 pt-20 pb-20 lg:px-8" id="features">
    <div class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm md:w-[350px]">
      <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Organization</div>
      <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">
        Free your backlog from "maybe one day" work
      </div>
      <div class="text-[15px] font-medium text-slate-500">
        Reduce clutter and allow your team to focus on the work that really matters.
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm md:w-[350px]">
      <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Convenience</div>
      <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">Stimulate creativity & innovation</div>
      <div class="text-[15px] font-medium text-slate-500">
        Capture ideas as they arise, without worrying if they are fully formed yet or thought-through.
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm md:w-[350px]">
      <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Collaboration</div>
      <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">
        Ideate and perfect solutions in context
      </div>
      <div class="text-[15px] font-medium text-slate-500">
        Pavrel's teams functionality allows you to share and collaborate on ideas with the right people.
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm md:w-[350px]">
      <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Speed</div>
      <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">Move fast, break nothing</div>
      <div class="text-[15px] font-medium text-slate-500">
        By separating ideas and maybes from real thought-through work, watch your team's productivity soar.
      </div>
    </div>

    <div class="w-full rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm md:w-[350px]">
      <div class="mb-3 text-sm font-medium tracking-tight text-blue-600">Intuitiveness</div>
      <div class="mb-3 text-[20px] font-medium tracking-tight text-slate-900">
        Everything you need, right at your fingertips
      </div>
      <div class="text-[15px] font-medium text-slate-500">
        Your team will love the crisp and modern interface, with blazing fast interactions and real-time sync.
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
</template>
