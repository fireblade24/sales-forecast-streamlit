self.addEventListener('push', function(event) {
  const data = event.data?.json?.() || { title: 'FlowTasks', body: 'Reminder' };
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body }));
});
