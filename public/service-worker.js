self.addEventListener('push', function(e) {
  console.log(e.data.json())
  const data = e.data.json()
  
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: './icons/logo64.png',
  })
})