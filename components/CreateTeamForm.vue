<script setup lang="ts">
import { LockClosedIcon, UsersIcon } from '@heroicons/vue/20/solid'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { Team } from '../types'
import FormLabel from './FormLabel.vue'
import FormTextInput from './FormTextInput.vue'
import Listbox from './Listbox.vue'

defineProps<{
  name: string
  slug: string
  privacy: Team['privacy']
  slugAlreadyExists?: Team
}>()

const updateName = (name: string) => {
  emit('update:name', name)
  emit('update:slug', name.split('').slice(0, 3).join('').toUpperCase())
}
const updateSlug = (slug: string) => emit('update:slug', slug.toUpperCase())
const updatePrivacy = (privacy: string) => emit('update:privacy', privacy)

const emit = defineEmits(['update:name', 'update:slug', 'update:privacy'])
</script>

<template>
  <div class="space-y-6">
    <div>
      <FormLabel for="teamName">Team name <span class="text-red-500">*</span></FormLabel>
      <div class="mt-1">
        <FormTextInput id="teamName" name="team-name" :model-value="name" @update:model-value="updateName" required />
      </div>
    </div>

    <div>
      <FormLabel for="teamSlug">Team identifier <span class="text-red-500">*</span></FormLabel>
      <div class="mt-1">
        <FormTextInput
          id="teamSlug"
          name="team-identifier"
          :model-value="slug"
          @update:model-value="updateSlug"
          class="max-w-[80px]"
          maxlength="5"
          required
        />
      </div>

      <div
        class="mt-2 flex items-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium leading-5 text-red-800"
        v-if="slugAlreadyExists"
      >
        <InformationCircleIcon class="mr-2 h-5 w-5 stroke-[2px]" />
        <span
          >That identifier is already being used by <span class="font-semibold">{{ slugAlreadyExists.name }}</span
          >.</span
        >
      </div>
    </div>

    <div>
      <FormLabel for="teamPrivacy">Team privacy</FormLabel>
      <div class="mt-1">
        <Listbox
          id="teamPrivacy"
          class="z-10"
          :value="privacy"
          @update-value="updatePrivacy"
          :options="[
            { text: 'Public', value: 'public', icon: UsersIcon },
            { text: 'Private', value: 'private', icon: LockClosedIcon },
          ]"
        />
      </div>
    </div>
  </div>
</template>
