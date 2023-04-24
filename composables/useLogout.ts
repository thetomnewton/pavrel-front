import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../api'

export function useLogout() {
  const store = useStore()
  const router = useRouter()

  const handleLogout = () => store.commit('base/handleLogout')

  const logout = async () => {
    await api.post('/logout')

    handleLogout()
    router.push('/login')
  }

  return { logout }
}
