<template>
  <header class="pt-4 px-8 max-w-4xl mx-auto">
    <div class="flex items-center">
      <div>logo</div>

      <div class="ml-10 flex items-center space-x-6">
        <a href="#features" class="font-medium text-sm text-slate-900 hover:text-slate-900">Features</a>
        <a href="#pricing" class="font-medium text-sm text-slate-900 hover:text-slate-900">Pricing</a>
      </div>

      <div class="ml-auto">
        <NuxtLink
          to="/login"
          class="inline-block rounded-lg px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 hover:shadow-sm border border-slate-300 active:shadow-none active:translate-y-px transition-all"
          >Log in</NuxtLink
        >
      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>
  <footer></footer>
</template>
