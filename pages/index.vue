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
  <section class="mx-auto max-w-4xl pt-20 pb-20 px-6 lg:px-8 sm:pt-24">
    <h1 class="text-3xl font-semibold tracking-tight sm:text-5xl text-slate-900">Unleash your creativity.</h1>
    <p class="mt-3 text-lg font-medium leading-8 text-slate-500">
      Pavrel is a home for your ideas. Designed for modern software teams.
    </p>

    <div class="mt-8">
      <NuxtLink
        to="/register"
        class="inline-block rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 border border-blue-600 px-6 py-1.5 text-base font-semibold leading-7 outline-none text-white ring-0 focus:ring-2 focus:ring-offset-2 ring-blue-600 hover:bg-blue-700 hover:ring-blue-700 shadow-md transition-all active:from-blue-700 active:translate-y-px"
      >
        Get started free
      </NuxtLink>
    </div>

    <div class="text-xs mt-3 text-slate-500">No credit card required.</div>
  </section>

  <section class="mx-auto pt-20 pb-20 px-6 lg:px-8 flex flex-wrap justify-center gap-6" id="features">
    <div class="w-full md:w-[350px] px-10 py-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
      <div class="text-blue-600 text-sm font-medium mb-3 tracking-tight">Organization</div>
      <div class="text-[20px] font-medium mb-3 text-slate-900 tracking-tight">
        Free your backlog from "maybe one day" work
      </div>
      <div class="text-slate-500 text-[15px] font-medium">
        Reduce clutter and allow your team to focus on the work that really matters.
      </div>
    </div>

    <div class="w-full md:w-[350px] px-10 py-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
      <div class="text-blue-600 text-sm font-medium mb-3 tracking-tight">Convenience</div>
      <div class="text-[20px] font-medium mb-3 text-slate-900 tracking-tight">Stimulate creativity & innovation</div>
      <div class="text-slate-500 text-[15px] font-medium">
        Capture ideas as they arise, without worrying if they are fully formed yet or thought-through.
      </div>
    </div>

    <div class="w-full md:w-[350px] px-10 py-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
      <div class="text-blue-600 text-sm font-medium mb-3 tracking-tight">Collaboration</div>
      <div class="text-[20px] font-medium mb-3 text-slate-900 tracking-tight">
        Ideate and perfect solutions in context
      </div>
      <div class="text-slate-500 text-[15px] font-medium">
        Pavrel's teams functionality allows you to share and collaborate on ideas with the right people.
      </div>
    </div>

    <div class="w-full md:w-[350px] px-10 py-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
      <div class="text-blue-600 text-sm font-medium mb-3 tracking-tight">Speed</div>
      <div class="text-[20px] font-medium mb-3 text-slate-900 tracking-tight">Move fast, break nothing</div>
      <div class="text-slate-500 text-[15px] font-medium">
        By separating ideas and maybes from real thought-through work, watch your team's productivity soar.
      </div>
    </div>

    <div class="w-full md:w-[350px] px-10 py-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
      <div class="text-blue-600 text-sm font-medium mb-3 tracking-tight">Intuitiveness</div>
      <div class="text-[20px] font-medium mb-3 text-slate-900 tracking-tight">
        Everything you need, right at your fingertips
      </div>
      <div class="text-slate-500 text-[15px] font-medium">
        Your team will love the crisp and modern interface, with blazing fast interactions and real-time sync.
      </div>
    </div>
  </section>
</template>
