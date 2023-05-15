const ACTION_KEY_DEFAULT = ['Ctrl ', 'Control'] as [string, string]
const ACTION_KEY_APPLE = ['⌘', 'Command'] as [string, string]

export function useActionKey() {
  const actionKey = ref<[string, string]>(['', ''])

  onMounted(() => {
    if (typeof navigator !== 'undefined') {
      if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
        actionKey.value = ACTION_KEY_APPLE
      } else {
        actionKey.value = ACTION_KEY_DEFAULT
      }
    }
  })

  return actionKey
}
