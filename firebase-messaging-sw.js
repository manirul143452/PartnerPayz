// Firebase Cloud Messaging Service Worker for PartnerPayz

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here.
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyBiwaYxkiyWCupQVGgUIOv7zuztdzlkPtc",
    authDomain: "partnerpayz.firebaseapp.com",
    projectId: "partnerpayz",
    storageBucket: "partnerpayz.appspot.com",
    messagingSenderId: "140540750518",
    appId: "1:140540750518:web:2bc8427ed17e2481b51417",
    measurementId: "G-YLCV2CGV57"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/images/logo.svg',
        badge: '/images/badge.png',
        // Add a custom clickAction if desired
        data: {
            click_action: payload.notification.click_action
        }
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    console.log('[firebase-messaging-sw.js] Notification click handled');
    event.notification.close();
    
    // Get the notification data passed in
    const clickAction = event.notification.data.click_action || '/dashboard.html';
    
    // This looks to see if the current window is already open and focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function(clientList) {
            // If a window tab matching the targeted URL already exists, focus that window
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes(clickAction) && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // If no matching client tab is found, open a new tab to the targeted URL
            if (clients.openWindow) {
                return clients.openWindow(clickAction);
            }
        })
    );
}); 