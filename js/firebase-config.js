// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";

// Your web app's Firebase configuration
// Auth handler URL: https://partnerpayz.firebaseapp.com/__/auth/handler
const firebaseConfig = {
    apiKey: "AIzaSyBiwaYxkiyWCupQVGgUIOv7zuztdzlkPtc",
    authDomain: "partnerpayz.firebaseapp.com",
    projectId: "partnerpayz",
    storageBucket: "partnerpayz.firebasestorage.app",
    messagingSenderId: "140540750518",
    appId: "1:140540750518:web:2bc8427ed17e2481b51417",
    measurementId: "G-YLCV2CGV57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);

// Request notification permission and get token
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: 'YOUR_VAPID_KEY' // You'll need to add your VAPID key here
            });
            console.log('Notification token:', token);
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error getting notification permission:', error);
        return null;
    }
}

// Function to send a notification programmatically
async function sendNotification(title, text, imageUrl = '/images/logo.png', notificationName = 'default_notification') {
    try {
        // This would typically be sent to your backend to trigger a Firebase Cloud Message
        const notificationData = {
            title: title,
            body: text,
            image: imageUrl,
            data: {
                notification_name: notificationName
            }
        };
        
        console.log('Sending notification:', notificationData);
        
        // For testing: display notification locally
        // In production: you would send this data to your server
        const notification = new Notification(title, {
            body: text,
            icon: imageUrl,
            data: { notification_name: notificationName }
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
    }
}

// Handle incoming messages
onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    
    // Create and show notification
    const notification = new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.image || '/images/logo.png',
        data: payload.data
    });
});

export { auth, messaging, requestNotificationPermission, sendNotification }; 