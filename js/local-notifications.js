/**
 * PartnerPayz Local Notifications Module
 * Handles browser notifications and notification history using localStorage
 */

// Storage keys
const NOTIFICATIONS_STORAGE_KEY = 'partnerpayz_notifications';

// Check if notifications are supported
export function areNotificationsSupported() {
    return 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission() {
    if (!areNotificationsSupported()) {
        console.warn('Notifications are not supported in this browser');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// Get notification permission status
export function getNotificationPermissionStatus() {
    if (!areNotificationsSupported()) {
        return 'unsupported';
    }
    
    return Notification.permission;
}

// Send a notification
export async function sendNotification(title, options = {}) {
    // Default options
    const defaultOptions = {
        body: '',
        icon: 'images/logo.png',
        badge: 'images/notification-badge.png',
        timestamp: Date.now(),
        requireInteraction: false,
        data: {}
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Check if notifications are supported and permission is granted
    if (!areNotificationsSupported()) {
        console.warn('Notifications are not supported in this browser');
        
        // Save to history even if not supported
        saveNotificationToHistory(title, mergedOptions);
        return null;
    }
    
    // If permission not granted, try to request it
    if (Notification.permission !== 'granted') {
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted) {
            console.warn('Notification permission not granted');
            
            // Save to history even if permission not granted
            saveNotificationToHistory(title, mergedOptions);
            return null;
        }
    }
    
    try {
        // Create and show notification
        const notification = new Notification(title, mergedOptions);
        
        // Add event listeners
        notification.onclick = function(event) {
            if (mergedOptions.data && mergedOptions.data.url) {
                window.open(mergedOptions.data.url, '_blank');
            }
            
            notification.close();
            
            // Call custom click handler if provided
            if (mergedOptions.onClick && typeof mergedOptions.onClick === 'function') {
                mergedOptions.onClick(event);
            }
        };
        
        // Save to history
        saveNotificationToHistory(title, mergedOptions);
        
        return notification;
    } catch (error) {
        console.error('Error showing notification:', error);
        
        // Save to history even if showing notification failed
        saveNotificationToHistory(title, mergedOptions);
        return null;
    }
}

// Save notification to history
function saveNotificationToHistory(title, options) {
    try {
        const notifications = getNotificationHistory();
        
        // Create notification history item
        const notificationItem = {
            id: generateNotificationId(),
            title,
            body: options.body || '',
            timestamp: options.timestamp || Date.now(),
            read: false,
            type: options.data?.type || 'general',
            url: options.data?.url || '',
            icon: options.icon || 'images/logo.png'
        };
        
        // Add to history (at the beginning)
        notifications.unshift(notificationItem);
        
        // Keep only the last 50 notifications
        const trimmedNotifications = notifications.slice(0, 50);
        
        // Save to localStorage
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(trimmedNotifications));
        
        // Update badge count if needed
        updateNotificationBadge();
        
        return notificationItem;
    } catch (error) {
        console.error('Error saving notification to history:', error);
        return null;
    }
}

// Get notification history
export function getNotificationHistory() {
    try {
        const notificationsJson = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        return notificationsJson ? JSON.parse(notificationsJson) : [];
    } catch (error) {
        console.error('Error getting notification history:', error);
        return [];
    }
}

// Mark notification as read
export function markNotificationAsRead(notificationId) {
    try {
        const notifications = getNotificationHistory();
        const index = notifications.findIndex(n => n.id === notificationId);
        
        if (index !== -1) {
            notifications[index].read = true;
            localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
            
            // Update badge count
            updateNotificationBadge();
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
}

// Mark all notifications as read
export function markAllNotificationsAsRead() {
    try {
        const notifications = getNotificationHistory();
        
        notifications.forEach(notification => {
            notification.read = true;
        });
        
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        
        // Update badge count
        updateNotificationBadge();
        
        return true;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }
}

// Delete notification
export function deleteNotification(notificationId) {
    try {
        const notifications = getNotificationHistory();
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
        
        // Update badge count
        updateNotificationBadge();
        
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}

// Clear all notifications
export function clearAllNotifications() {
    try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
        
        // Update badge count
        updateNotificationBadge();
        
        return true;
    } catch (error) {
        console.error('Error clearing all notifications:', error);
        return false;
    }
}

// Get unread notification count
export function getUnreadNotificationCount() {
    try {
        const notifications = getNotificationHistory();
        return notifications.filter(n => !n.read).length;
    } catch (error) {
        console.error('Error getting unread notification count:', error);
        return 0;
    }
}

// Update notification badge in the UI
export function updateNotificationBadge() {
    const unreadCount = getUnreadNotificationCount();
    
    // Update all notification badges on the page
    const badges = document.querySelectorAll('.notification-badge, #notificationBadge');
    
    badges.forEach(badge => {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
    
    return unreadCount;
}

// Generate a unique ID for notifications
function generateNotificationId() {
    return 'notif_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
} 