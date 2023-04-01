import axios from '../api'

export function csrf() {
  return axios.get('/sanctum/csrf-cookie')
}
