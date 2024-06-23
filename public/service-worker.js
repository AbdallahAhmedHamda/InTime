self.addEventListener('push', function(e) {
  const data = e.data.json()
  
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: './icons/logo64.png',
  })

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'PUSH_NOTIFICATION_RECEIVED',
      })
    })
  })
})