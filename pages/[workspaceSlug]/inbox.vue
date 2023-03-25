<script setup lang="ts">
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
      </div>
    </div>

    <div class="flex-1">
      <NotificationPreviewPane
        v-if="selectedIdea && selectedNotification"
        :notification="selectedNotification"
        :idea="selectedIdea"
        @back="selectedNotificationId = null"
      />
    </div>
  </div>
</template>
