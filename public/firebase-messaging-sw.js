/**
 * MindBlink - Firebase Cloud Messaging Service Worker
 * Handles background push notifications when user is away from tab.
 */

// Import scripts for Firebase in service worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Live Provisioned Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC7_7vmisSlEXQ_x2lM1g7TLfFvVZPIFzk",
  authDomain: "gen-lang-client-0728617441.firebaseapp.com",
  projectId: "gen-lang-client-0728617441",
  storageBucket: "gen-lang-client-0728617441.firebasestorage.app",
  messagingSenderId: "48667653274",
  appId: "1:48667653274:web:9ccba31228ef7263a31b23"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const messaging = firebase.messaging();

  // Background message handler
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'MindBlink Daily Challenge';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'A new mind-bending puzzle is waiting for you!',
      icon: payload.notification?.icon || '/assets/images/puzzle_optical_illusion_1793853160407.jpg',
      badge: '/assets/images/puzzle_optical_illusion_1793853160407.jpg',
      data: {
        url: payload.data?.url || '/user.html',
        puzzleId: payload.data?.puzzleId || ''
      },
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open', title: 'Solve Now' },
        { action: 'dismiss', title: 'Later' }
      ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('Firebase Messaging SW config error:', e.message);
}

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/user.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('user.html') && 'focus' in client) {
          if (client.navigate) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
