<script setup lang="ts">
import BaseButtonLinkRouter from './BaseButtonLinkRouter.vue'
import LogoColorText from './LogoColorText.vue'

defineProps<{
  canLogin: boolean
  canRegister: boolean
}>()
</script>

<template>
  <header v-if="canLogin" class="flex items-center">
    <div>
      <RouterLink to="/" class="inline-block px-4 pt-4 pb-4">
        <LogoColorText class="w-[100px] text-white" />
      </RouterLink>
    </div>

    <div class="ml-auto flex items-center">
      <RouterLink to="/login" class="hover:text-blue-slate-300 mr-4 text-sm font-medium text-white">
        Log in
      </RouterLink>

      <BaseButtonLinkRouter v-if="canRegister" to="/register" button="primary"> Sign up </BaseButtonLinkRouter>
    </div>
  </header>
</template>
