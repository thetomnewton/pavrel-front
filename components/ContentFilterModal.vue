<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseDialog from './BaseDialog.vue'
import FormTextInput from './FormTextInput.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close', 'apply'])

const content = ref<HTMLElement | undefined>(undefined)

const textContent = ref('')

watch(
  () => props.open,
  newValue => {
    if (newValue) textContent.value = ''
    else {
      setTimeout(() => (textContent.value = ''), 150)
    }
  }
)

const applyFilter = () => {
  emit('apply', textContent.value)
  emit('close')
}
</script>

<template>
  <BaseDialog
    :open="open"
    :initial-focus="content"
    class="mx-auto w-full max-w-[500px] rounded-md bg-white px-8 py-6 shadow-3xl dark:border dark:border-zinc-700 dark:bg-zinc-900 md:mt-[12vh]"
    @close="emit('close')"
  >
    <div class="mb-4 font-medium">Filter by content</div>

    <form @submit.prevent="applyFilter">
      <div>
        <FormTextInput ref="content" v-model="textContent" />
      </div>

      <div class="mt-4 flex justify-end">
        <BaseButton button="primary" size="md" type="submit">Apply</BaseButton>
      </div>
    </form>
  </BaseDialog>
</template>
