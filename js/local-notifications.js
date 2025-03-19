// Simple notification system using browser's Notification API and localStorage
// This is a basic implementation for demonstration purposes

// Notification storage
const NOTIFICATIONS_STORAGE_KEY = 'partnerpayz_notifications';

// Initialize notifications if not exists
function initNotifications() {
    if (!localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)) {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
    }
}

// Get all notifications
function getNotifications() {
    initNotifications();
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || '[]');
}

// Save notifications
function saveNotifications(notifications) {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
}

// Request notification permission
export async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.error("This browser does not support notifications");
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
    }
}

// Send notification
export async function sendNotification(title, text, imageUrl = '/images/logo.png', notificationType = 'default') {
    // Check permission
    if (Notification.permission !== "granted") {
        const granted = await requestNotificationPermission();
        if (!granted) {
            return { success: false, error: "Notification permission not granted" };
        }
    }

    try {
        // Create notification options
        const options = {
            body: text,
            icon: imageUrl,
            tag: notificationType,
            data: { type: notificationType },
            actions: getNotificationActions(notificationType)
        };

        // Create and show notification
        const notification = new Notification(title, options);

        // Add click handler
        notification.onclick = (event) => {
            event.preventDefault();
            handleNotificationClick(notification);
        };

        // Store notification in history
        const notifications = getNotifications();
        notifications.unshift({
            id: Date.now().toString(),
            title,
            body: text,
            image: imageUrl,
            type: notificationType,
            read: false,
            createdAt: new Date().toISOString()
        });

        // Keep only the last 50 notifications
        if (notifications.length > 50) {
            notifications.length = 50;
        }
        
        saveNotifications(notifications);

        return { success: true };
    } catch (error) {
        console.error("Error sending notification:", error);
        return { success: false, error: error.message };
    }
}

// Get notification actions based on type
function getNotificationActions(type) {
    // Only supported in service workers, but we define them for completeness
    switch (type) {
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
function handleNotificationClick(notification) {
    notification.close();
    
    const type = notification.data?.type || 'default';
    
    // Navigate based on notification type
    switch (type) {
        case 'new_match':
            window.location.href = '/partners.html?section=matches';
            break;
        case 'new_message':
            window.location.href = '/messages.html';
            break;
        case 'payment_received':
            window.location.href = '/dashboard.html?section=transactions';
            break;
        case 'anniversary_reminder':
            window.location.href = '/dashboard.html?section=calendar';
            break;
        default:
            window.location.href = '/dashboard.html';
    }
}

// Get unread notifications count
export function getUnreadCount() {
    const notifications = getNotifications();
    return notifications.filter(n => !n.read).length;
}

// Mark notification as read
export function markAsRead(notificationId) {
    const notifications = getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
        notifications[index].read = true;
        saveNotifications(notifications);
        return true;
    }
    
    return false;
}

// Mark all notifications as read
export function markAllAsRead() {
    const notifications = getNotifications();
    notifications.forEach(n => n.read = true);
    saveNotifications(notifications);
}

// Clear all notifications
export function clearAllNotifications() {
    saveNotifications([]);
}

// Schedule a notification to be shown later
export function scheduleNotification(title, text, delayInMinutes, imageUrl = '/images/logo.png', notificationType = 'scheduled') {
    const delayInMs = delayInMinutes * 60 * 1000;
    
    setTimeout(() => {
        sendNotification(title, text, imageUrl, notificationType);
    }, delayInMs);
} 