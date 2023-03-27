import Cookies from 'js-cookie'

export function useApi() {
  const config = useRuntimeConfig()

  const api = (url: string, args = {}) => {
    return useFetch(url, {
      ...{
        baseURL: config.public.backendUrl,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') ?? '',
          referer: config.public.backendUrl,
        },
      },
      ...args,
    })
  }

  return { api }
}
