<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size: number
}>()

const actualSize = computed(() => `${props.size || 20}px`)
const borderSize = computed(() => `${Math.floor(props.size || 20) / 8}px`)
</script>

<template>
  <div class="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style scoped>
.lds-ring {
  display: inline-block;
  position: relative;
  width: v-bind(actualSize);
  height: v-bind(actualSize);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: v-bind(actualSize);
  height: v-bind(actualSize);
  border: v-bind(borderSize) solid #94a3b8;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #94a3b8 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
