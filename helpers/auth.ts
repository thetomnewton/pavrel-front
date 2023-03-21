import api from '../api'

export function csrf() {
  return api.get('/sanctum/csrf-cookie')
}
