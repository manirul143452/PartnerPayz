// Firebase Authentication Module for PartnerPayz
// This module handles user authentication, registration, and notifications

// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    FacebookAuthProvider, 
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiwaYxkiyWCupQVGgUIOv7zuztdzlkPtc",
    authDomain: "partnerpayz.firebaseapp.com",
    projectId: "partnerpayz",
    storageBucket: "partnerpayz.appspot.com",
    messagingSenderId: "140540750518",
    appId: "1:140540750518:web:2bc8427ed17e2481b51417",
    measurementId: "G-YLCV2CGV57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Authentication state observer
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        updateUIForLoggedInUser(user);
    } else {
        // User is signed out
        currentUser = null;
        updateUIForLoggedOutUser();
    }
});

// Push notification request and setup
function setupNotifications() {
    // Request permission for notifications
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
            
            // Get the token
            getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
                if (currentToken) {
                    // Save the token to database for this user
                    if (currentUser) {
                        saveTokenToDatabase(currentToken, currentUser.uid);
                    }
                    
                    // Send token to your server
                    console.log('Token received:', currentToken);
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
    
    // Handle foreground messages
    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        
        // Customize notification appearance
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/images/logo.svg',
            badge: '/images/badge.png',
            clickAction: payload.notification.click_action
        };
        
        // Show notification
        if (!("Notification" in window)) {
            console.log("This browser does not support system notifications");
        } else if (Notification.permission === "granted") {
            var notification = new Notification(notificationTitle, notificationOptions);
            notification.onclick = function(event) {
                event.preventDefault();
                window.open(payload.notification.click_action, '_blank');
                notification.close();
            }
        }
    });
}

// Save the notification token to user's profile in database
async function saveTokenToDatabase(token, userId) {
    const userRef = doc(db, "users", userId);
    
    try {
        await updateDoc(userRef, {
            notificationTokens: arrayUnion(token)
        });
        console.log('Token saved to database');
    } catch (error) {
        console.error('Error saving token to database:', error);
    }
}

// Register a new user with email and password
async function registerUser(email, password, userData) {
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Send verification email
        await sendEmailVerification(user);
        
        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            email: email,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Setup notifications for the user
        setupNotifications();
        
        showToast('Account created successfully! Please check your email for verification.', 'success');
        return user;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

// Sign in an existing user with email and password
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Setup notifications for the user
        setupNotifications();
        
        showToast('Logged in successfully!', 'success');
        return user;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

// Sign in with Google
async function signInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if this is a new user
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
            // Create a user document for new Google sign-ins
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        // Setup notifications for the user
        setupNotifications();
        
        showToast('Logged in with Google successfully!', 'success');
        return user;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

// Sign in with Facebook
async function signInWithFacebook() {
    try {
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if this is a new user
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
            // Create a user document for new Facebook sign-ins
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        // Setup notifications for the user
        setupNotifications();
        
        showToast('Logged in with Facebook successfully!', 'success');
        return user;
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

// Sign out the current user
async function logoutUser() {
    try {
        await signOut(auth);
        showToast('Logged out successfully!', 'success');
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

// Send password reset email
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent. Please check your inbox.', 'success');
    } catch (error) {
        handleAuthError(error);
        throw error;
    }
}

// Update UI for logged-in users
function updateUIForLoggedInUser(user) {
    // Hide login/register buttons, show user info
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        // Create user menu if it doesn't exist
        if (!document.querySelector('.user-menu')) {
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <div class="user-avatar">
                    <img src="${user.photoURL || 'images/default-avatar.png'}" alt="User Avatar">
                </div>
                <div class="user-info">
                    <span class="user-name">${user.displayName || 'User'}</span>
                </div>
                <div class="user-dropdown">
                    <a href="dashboard.html">Dashboard</a>
                    <a href="profile.html">Profile</a>
                    <a href="settings.html">Settings</a>
                    <a href="#" id="logoutBtn">Logout</a>
                </div>
            `;
            
            // Replace auth buttons with user menu
            authButtons.innerHTML = '';
            authButtons.appendChild(userMenu);
            
            // Add logout event listener
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                logoutUser();
            });
            
            // Toggle dropdown on click
            userMenu.addEventListener('click', () => {
                userMenu.classList.toggle('active');
            });
        }
    }
    
    // Update any other elements as needed
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.displayName || 'User'}!`;
    }
}

// Update UI for logged-out users
function updateUIForLoggedOutUser() {
    // Show login/register buttons, hide user info
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        // Restore default auth buttons if logged out
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Log In</a>
            <a href="register.html" class="btn btn-primary">Sign Up</a>
        `;
    }
    
    // Update any other elements as needed
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = 'Welcome, Guest!';
    }
    
    // Redirect to login page if on a protected page
    const currentLocation = window.location.href;
    const protectedPages = ['dashboard.html', 'profile.html', 'settings.html'];
    
    if (protectedPages.some(page => currentLocation.includes(page))) {
        window.location.href = 'login.html';
    }
}

// Handle Firebase authentication errors
function handleAuthError(error) {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/invalid-email':
            message = 'Invalid email address format.';
            break;
        case 'auth/user-disabled':
            message = 'This account has been disabled.';
            break;
        case 'auth/user-not-found':
            message = 'No account found with this email address.';
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password.';
            break;
        case 'auth/email-already-in-use':
            message = 'This email is already associated with an account.';
            break;
        case 'auth/operation-not-allowed':
            message = 'Operation not allowed.';
            break;
        case 'auth/weak-password':
            message = 'Password is too weak. Please use a stronger password.';
            break;
        case 'auth/popup-closed-by-user':
            message = 'Sign-in popup was closed before completing the process.';
            break;
        default:
            message = `Error: ${error.message}`;
    }
    
    showToast(message, 'error');
}

// Show toast notification
function showToast(message, type = 'info') {
    if (typeof window.showToast === 'function') {
        // Use the global showToast function if available
        window.showToast(message, type);
    } else {
        // Create and show a toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${getToastIcon(type)}"></i>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove after timeout
        setTimeout(() => {
            removeToast(toast);
        }, 5000);
        
        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            removeToast(toast);
        });
    }
}

// Get icon for toast notification
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info':
        default: return 'fa-info-circle';
    }
}

// Remove toast notification
function removeToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    // Remove from DOM after animation
    toast.addEventListener('transitionend', () => {
        toast.remove();
    });
}

// Export functions for use in other modules
export {
    registerUser,
    loginUser,
    logoutUser,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword,
    currentUser,
    setupNotifications
}; 