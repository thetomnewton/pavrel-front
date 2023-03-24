import { cloneDeep } from 'lodash-es'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Idea, WorkspaceNotification } from '../types'

export function useInbox() {
  const store = useStore()

  const getCurrentTeamIdeaById = computed<(id: string) => Idea | undefined>(
    () => store.getters['base/getCurrentTeamIdeaById']
  )

  const allNotifications = computed<WorkspaceNotification[]>(() =>
    cloneDeep(store.state.base.workspaceNotifications).sort(
      (a: WorkspaceNotification, b: WorkspaceNotification) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )

  const notifications = computed<WorkspaceNotification[]>(() =>
    allNotifications.value.filter(n => n.deleted_at == null)
  )

  const unreadNotificationsCount = computed<number>(
    () => notifications.value.filter(n => n.read_at == null).length ?? 0
  )

  const selectedNotificationId = ref<number | null>(null)
  const selectedNotification = computed<WorkspaceNotification | undefined>(() =>
    notifications.value.find(notification => notification.id === selectedNotificationId.value)
  )

  const isSelectedNotification = (notification: WorkspaceNotification) =>
    notification.id === selectedNotification.value?.id

  const selectedIdea = computed(() => {
    const notification = selectedNotification.value
    if (!notification) return null

    if (notification.meta.source_type === 'Idea') {
      return getCurrentTeamIdeaById.value(notification.meta.source_id) || null
    } else if (notification.meta.source_type === 'Comment' && notification.meta.parent_id) {
      return getCurrentTeamIdeaById.value(notification.meta.parent_id) || null
    }

    return null
  })

  function selectInboxItem(notification: WorkspaceNotification) {
    selectedNotificationId.value = notification.id

    markNotificationAsRead(notification)
  }

  const markNotificationAsRead = (notification: WorkspaceNotification) => {
    store.commit('base/markNotificationAsRead', notification)
    store.dispatch('base/markNotificationAsRead', notification)
  }

  const markNotificationAsUnread = (notification: WorkspaceNotification) => {
    store.commit('base/markNotificationAsUnread', notification)
    store.dispatch('base/markNotificationAsUnread', notification)
  }

  const deleteNotification = (notification: WorkspaceNotification) => {
    store.commit('base/trashNotification', notification)
    store.dispatch('base/deleteNotification', notification)
  }

  const addWorkspaceNotification = (notification: WorkspaceNotification) =>
    store.commit('base/addWorkspaceNotification', notification)

  return {
    notifications,
    selectedNotification,
    selectedNotificationId,
    selectedIdea,
    isSelectedNotification,
    selectInboxItem,
    markNotificationAsRead,
    markNotificationAsUnread,
    deleteNotification,
    unreadNotificationsCount,
    addWorkspaceNotification,
  }
}
