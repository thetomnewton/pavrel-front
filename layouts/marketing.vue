<template>
  <header class="mx-auto max-w-4xl px-8 pt-4">
    <div class="flex items-center">
      <NuxtLink to="/">
        <span class="sr-only">Pavrel</span>
        <LogoColorText class="h-[30px] w-[96px] text-slate-800" />
      </NuxtLink>

      <div class="ml-10 flex items-center space-x-6">
        <a href="#features" class="text-sm font-medium text-slate-900 hover:text-slate-900">Features</a>
        <a href="#pricing" class="text-sm font-medium text-slate-900 hover:text-slate-900">Pricing</a>
      </div>

      <div class="ml-auto">
        <NuxtLink
          to="/login"
          class="inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium leading-5 text-slate-800 transition-all hover:shadow-sm active:translate-y-px active:shadow-none"
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
