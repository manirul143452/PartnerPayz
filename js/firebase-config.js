// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";

// Your web app's Firebase configuration
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

// Handle incoming messages
onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    
    // Create and show notification
    const notification = new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/images/logo.png'
    });
});

export { auth, messaging, requestNotificationPermission }; 