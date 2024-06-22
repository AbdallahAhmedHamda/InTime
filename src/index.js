import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { usePushNotifications } from './hooks/usePushNotifications'
import App from './App'
import './css/index.css'

// const {
//   fetchApi: fetchPushNotificationApi,
//   apiError: pushNotificationApiError,
// } = useApi(pushNotificationApi)

// useEffect(() => {
//   if (pushNotificationApiError) {
//     console.log(pushNotificationApiError)
//   }
// }, [pushNotificationApiError])

// const publicVapidKey = 'BHFt6_eEe_48pKibuRHqzJuWsfecm0wTV_MoqZ7-Ydj0FuU5k9ytMaB6zPrYvIotq6GS_nHCeumoeO6_Zu4zRto'

// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4)
//   const base64 = (base64String + padding)
//     .replace(/-/g, '+')
//     .replace(/_/g, '/')

//   const rawData = window.atob(base64)
//   const outputArray = new Uint8Array(rawData.length)

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i)
//   }
//   return outputArray
// }

// if ('serviceWorker' in navigator && 'PushManager' in window) {
//   window.addEventListener('load', async () => {
//     try {
//       const register = await navigator.serviceWorker.register('/service-worker.js', {
//         scope: '/'
//       })

//       try {
//         const subscription = await register.pushManager.subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
//         })

//         await fetchPushNotificationApi(subscription)
//       } catch (error) {
//       console.error('Push registration failed:', error)
//       }
//     } catch (error) {
//       console.error('Service Worker registration failed:', error)
//     }
//   })
// }


function Main() {
  usePushNotifications()

  return <App />
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <Main />
  </Provider>
)