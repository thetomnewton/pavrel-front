import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '../api'

export function createEcho(backendUrl: string) {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window.Pusher === undefined) window.Pusher = Pusher

    type AuthChannel = { name: string }
    type AuthCallback = (error: boolean, data: object) => void

    return new Echo({
      broadcaster: 'pusher',
      key: 'app-key',
      wsHost: 'localhost',
      wsPort: 6001,
      forceTLS: backendUrl.split(':')[0] === 'https',
      disableStats: true,
      authorizer: (channel: AuthChannel) => ({
        authorize: (socketId: number, callback: AuthCallback) => {
          api
            .post(`${backendUrl}/broadcasting/auth`, {
              socket_id: socketId,
              channel_name: channel.name,
            })
            .then(response => {
              callback(false, response.data)
            })
            .catch(error => {
              callback(true, error)
            })
        },
      }),
    })
  }
}
