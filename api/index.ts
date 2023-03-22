import axios from 'axios'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  error => {
    // If we're supposed to be logged-in, redirect to /login
    if (error.response.status === 419 || error.response.status === 401) {
      location.href = '/login'
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default {
  get(url: string) {
    const config = useRuntimeConfig()
    return axios.get(url, { baseURL: config.public.backendUrl })
  },

  post(url: string, params: object) {
    const config = useRuntimeConfig()
    return axios.post(url, params, { baseURL: config.public.backendUrl })
  },

  put(url: string, params: object) {
    const config = useRuntimeConfig()
    return axios.put(url, params, { baseURL: config.public.backendUrl })
  },

  patch(url: string, params: object) {
    const config = useRuntimeConfig()
    return axios.put(url, params, { baseURL: config.public.backendUrl })
  },

  delete(url: string) {
    const config = useRuntimeConfig()
    return axios.delete(url, { baseURL: config.public.backendUrl })
  },
}
