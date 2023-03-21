<script setup lang="ts">
import { watchForDarkMode } from '~~/helpers/dark'

watchForDarkMode()
</script>

<template>
  <slot />
</template>
