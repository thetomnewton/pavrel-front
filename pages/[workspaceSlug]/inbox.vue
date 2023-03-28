<script setup lang="ts">
import { InboxIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'Inbox',
})

const {
  notifications,
  selectedNotification,
  selectedNotificationId,
  isSelectedNotification,
  selectInboxItem,
  selectedIdea,
} = useInbox()
</script>

<template>
  <div class="flex h-full">
    <div
      class="flex w-full flex-col border-slate-200 lg:w-[350px] lg:border-r lg:border-slate-100 dark:lg:border-slate-800"
      :class="[selectedNotification ? 'hidden lg:block' : '']"
    >
      <PageHeader :show-options="false" :show-filters="false" class="border-b border-slate-100 dark:border-zinc-800">
        <span class="font-medium lg:ml-[-14px]">Inbox</span>
      </PageHeader>

      <div class="overflow-auto">
        <InboxListItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          :selected="isSelectedNotification(notification)"
          @click="selectInboxItem(notification)"
        />

        <template v-if="!notifications.length">
          <div class="flex flex-col items-center justify-center pt-24">
            <div
              class="rounded-full border border-slate-100 bg-slate-50 p-[10px] text-slate-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
            >
              <InboxIcon class="h-6 w-6" />
            </div>
            <div class="mt-2 text-xs font-medium text-slate-500 dark:text-zinc-400">No items</div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex-1">
      <div v-if="!notifications.length" class="hidden h-full items-center justify-center p-12 lg:flex">
        <div class="flex flex-col items-center justify-center">
          <InboxIcon class="h-12 w-12 stroke-[1px] text-slate-400 dark:text-zinc-500" />
        </div>
      </div>

      <NotificationPreviewPane
        v-if="selectedIdea && selectedNotification"
        :notification="selectedNotification"
        :idea="selectedIdea"
        @back="selectedNotificationId = null"
      />
    </div>
  </div>
</template>
