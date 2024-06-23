import { useEffect } from 'react'
import useApi from './useApi'
import { pushNotificationApi } from '../apis/userApi'

const publicVapidKey = 'BKJXQD5Lv5jTRNClUqtNW_gndhzxOBS9wXYwaWo8vNlHK2ReCCiG8tnS3fdcfCVHtTfnzpNR5Ia5kxQr6Z_8KFw'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function usePushNotifications() {
  const {
    fetchApi: fetchPushNotificationApi,
  } = useApi(pushNotificationApi)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registerServiceWorker = async () => {
        try {
          const register = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          })

          try {
            const subscription = await register.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            })

            await fetchPushNotificationApi(subscription)
          } catch (error) {
            console.error('Push registration failed:', error)
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }

      window.addEventListener('load', registerServiceWorker)
    }
  }, [fetchPushNotificationApi])
}