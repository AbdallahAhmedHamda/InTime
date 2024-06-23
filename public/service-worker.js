self.addEventListener('push', function(e) {
  console.log(e.data.json())
  const data = e.data.json()
  
  console.log(data.message)
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: './icons/logo64.png',
  })
})