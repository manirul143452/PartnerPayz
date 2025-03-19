importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBiwaYxkiyWCupQVGgUIOv7zuztdzlkPtc",
    authDomain: "partnerpayz.firebaseapp.com",
    projectId: "partnerpayz",
    storageBucket: "partnerpayz.firebasestorage.app",
    messagingSenderId: "140540750518",
    appId: "1:140540750518:web:2bc8427ed17e2481b51417",
    measurementId: "G-YLCV2CGV57"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        data: payload.data,
        actions: payload.data.actions || []
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Handle notification actions
    if (event.action) {
        // Handle specific actions based on the notification
        const action = event.action;
        const data = event.notification.data;

        // Example: Handle different notification types
        switch (action) {
            case 'view_transaction':
                // Open transaction details
                event.waitUntil(
                    clients.openWindow(`/dashboard.html?transaction=${data.transactionId}`)
                );
                break;
            case 'view_message':
                // Open messages
                event.waitUntil(
                    clients.openWindow('/messages.html')
                );
                break;
            default:
                // Default action: open dashboard
                event.waitUntil(
                    clients.openWindow('/dashboard.html')
                );
        }
    } else {
        // Default click action: open dashboard
        event.waitUntil(
            clients.openWindow('/dashboard.html')
        );
    }
}); 