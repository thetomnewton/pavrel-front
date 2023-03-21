import dayjs from 'dayjs/esm'
import relative from 'dayjs/esm/plugin/relativeTime'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { IdeaActivity, User } from '../types'

dayjs.extend(relative)

export function useIdeaActivities() {
  const fromNow = (ts: string) => dayjs(ts).fromNow()

  const store = useStore()

  const users = computed<User[]>(() => store.state.base.users)

  const initiatorName = (activity: IdeaActivity) => {
    if (activity.initiator_type === 'system') return 'Pavrel'

    return users.value.find(user => user.id === activity.initiator_id)?.name ?? 'Unknown user'
  }

  return {
    fromNow,
    initiatorName,
  }
}
