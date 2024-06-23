import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { usePushNotifications } from './hooks/usePushNotifications'
import App from './App'
import './css/index.css'

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