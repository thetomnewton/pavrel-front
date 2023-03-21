<script setup lang="ts">
function goto() {
  location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/microsoft/redirect`
}
</script>

<template>
  <div
    @click="goto"
    class="mb-2 block w-full cursor-pointer rounded border bg-slate-50 py-2 text-center text-sm font-medium leading-[20px] hover:border-slate-300 focus:bg-slate-100"
  >
    <span class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" class="mr-2 h-4 w-4">
        <path fill="#f3f3f3" d="M0 0h23v23H0z" />
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
      <span>Continue with Microsoft</span>
    </span>
  </div>
</template>
