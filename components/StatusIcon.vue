<script setup lang="ts">
defineProps<{
  category?: number
}>()
</script>

<template>
  <div>
    <svg
      v-if="category === 0"
      xmlns="http://www.w3.org/2000/svg"
      class="h-[17px] w-[17px] text-slate-400"
      viewBox="1 1 18 18"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clip-rule="evenodd"
      />
    </svg>

    <svg
      v-if="category === 1"
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-[17px] overflow-hidden text-orange-400"
      fill="currentColor"
      style="vertical-align: middle"
      viewBox="195 190 640 640"
    >
      <path
        d="M512.5 829C337.702 829 196 687.298 196 512.5S337.702 196 512.5 196 829 337.702 829 512.5 687.298 829 512.5 829z m0-60C654.161 769 769 654.161 769 512.5S654.161 256 512.5 256 256 370.839 256 512.5 370.839 769 512.5 769zM483 622h46a7 7 0 0 1 7 7v46a7 7 0 0 1-7 7h-46a7 7 0 0 1-7-7v-46a7 7 0 0 1 7-7z m53.042-57.45v30h-60v-30c0-4.463 0.027-7.062 0.155-10.328 0.303-7.719 0.946-13.36 2.901-19.091 1.649-4.832 2.855-7.873 4.802-11.425 2.952-5.385 6.803-9.983 11.75-13.847 6.844-5.346 13.437-8.17 28.196-13.239 7.959-2.733 19.842-10.089 28.818-18.845C562.774 467.912 568 457.827 568 448.5c0-30.652-24.848-55.5-55.5-55.5S457 417.848 457 448.5v30h-60v-30c0-63.789 51.711-115.5 115.5-115.5S628 384.711 628 448.5c0 27.488-12.696 51.989-33.439 72.224-15.298 14.924-34.823 27.01-51.228 32.644-3 1.03-5.325 1.857-7.153 2.544-0.117 2.906-0.138 4.933-0.138 8.638z"
      />
    </svg>

    <svg
      class="h-[17px] w-[17px] text-slate-300"
      v-if="category === 2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="1 1 21.5 21.5"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <svg
      v-if="category === 3"
      xmlns="http://www.w3.org/2000/svg"
      class="h-[17px] w-[17px] text-slate-400"
      fill="none"
      viewBox="1 1 21.5 21.5"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <svg
      class="h-[17px] w-[17px] text-blue-500"
      v-if="category === 4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="1 1 21.5 21.5"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <svg
      v-if="category === 5"
      xmlns="http://www.w3.org/2000/svg"
      class="h-[17px] w-[17px] text-blue-600"
      fill="none"
      viewBox="1 1 21.5 21.5"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <svg
      v-if="category === 6"
      xmlns="http://www.w3.org/2000/svg"
      class="h-[17px] w-[17px] text-green-600"
      viewBox="1 1 18 18"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>
