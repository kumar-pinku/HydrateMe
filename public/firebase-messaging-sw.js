importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAjoIyoDwGIEQjGY7xhN38uARgdgvZ-MGY",
    authDomain: "hydrateme-2025.firebaseapp.com",
    projectId: "hydrateme-2025",
    appId: "1:842344742051:web:d4110dadbea85e9f919316",
    messagingSenderId: "842344742051",
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//     self.registration.showNotification(
//         payload.notification.title,
//         { body: payload.notification.body }
//     );
// });

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message', payload);
  
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/icon-192x192.png',
    });
  });
  

