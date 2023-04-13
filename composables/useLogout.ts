import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../api'

export function useLogout() {
  const store = useStore()
  const router = useRouter()

  const handleLogout = () => store.commit('base/handleLogout')

  const logout = () => {
    api.post('/logout')

    // Axios does not resolve on 204, so hacking with setTimeout
    setTimeout(() => {
      handleLogout()
      localStorage.setItem('isLoggedIn', 'false')
      router.push('/login')
    }, 100)
  }

  return { logout }
}
