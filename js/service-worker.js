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
        icon: payload.notification.image || '/images/logo.png',
        badge: '/images/logo.png',
        image: payload.notification.image,
        data: payload.data || {},
        tag: payload.data?.notification_name || 'default_notification',
        actions: getNotificationActions(payload.data?.notification_name)
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Get appropriate actions based on notification type
function getNotificationActions(notificationType) {
    switch (notificationType) {
        case 'new_match':
            return [
                { action: 'view_match', title: 'View Match' },
                { action: 'dismiss', title: 'Dismiss' }
            ];
        case 'new_message':
            return [
                { action: 'reply', title: 'Reply' },
                { action: 'view_conversation', title: 'View' }
            ];
        case 'payment_received':
            return [
                { action: 'view_transaction', title: 'View Details' }
            ];
        case 'anniversary_reminder':
            return [
                { action: 'view_calendar', title: 'Open Calendar' },
                { action: 'send_message', title: 'Send Message' }
            ];
        default:
            return [];
    }
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const data = event.notification.data || {};
    const notificationType = data.notification_name || 'default';

    // Handle notification actions
    if (event.action) {
        handleNotificationAction(event.action, data);
    } else {
        // Default click based on notification type
        handleNotificationType(notificationType, data);
    }
});

// Handle specific actions
function handleNotificationAction(action, data) {
    switch (action) {
        case 'view_match':
            clients.openWindow(`/partners.html?match=${data.matchId}`);
            break;
        case 'reply':
            clients.openWindow(`/messages.html?conversation=${data.conversationId}&reply=true`);
            break;
        case 'view_conversation':
            clients.openWindow(`/messages.html?conversation=${data.conversationId}`);
            break;
        case 'view_transaction':
            clients.openWindow(`/dashboard.html?transaction=${data.transactionId}`);
            break;
        case 'view_calendar':
            clients.openWindow(`/dashboard.html?section=calendar&date=${data.date}`);
            break;
        case 'send_message':
            clients.openWindow(`/messages.html?to=${data.partnerId}&template=anniversary`);
            break;
        default:
            clients.openWindow('/dashboard.html');
    }
}

// Handle notification type
function handleNotificationType(type, data) {
    switch (type) {
        case 'new_match':
            clients.openWindow(`/partners.html?section=matches`);
            break;
        case 'new_message':
            clients.openWindow(`/messages.html`);
            break;
        case 'payment_received':
            clients.openWindow(`/dashboard.html?section=transactions`);
            break;
        case 'anniversary_reminder':
            clients.openWindow(`/dashboard.html?section=calendar`);
            break;
        default:
            clients.openWindow('/dashboard.html');
    }
} 