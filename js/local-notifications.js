/**
 * PartnerPayz Notifications Module
 * Handles browser notifications and the notification center
 */

// Constants for storage
const NOTIFICATIONS_KEY = 'notifications';

// Initialize on module load
document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission if not granted
    requestNotificationPermission();
    
    // Update notification badge on load
    updateNotificationBadge();
    
    // Setup notification icon click handler
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            window.location.href = 'notifications.html';
        });
    }
});

/**
 * Request permission to show browser notifications
 */
export function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    
                    // Send welcome notification
                    const currentUser = getCurrentUser();
                    if (currentUser) {
                        sendBrowserNotification(
                            'Welcome to PartnerPayz',
                            `Hi ${currentUser.name || 'there'}! You'll now receive notifications.`,
                            'info'
                        );
                    }
                }
            });
        }
    }
}

/**
 * Send browser notification and store in history
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'info', 'success', 'warning', 'error'
 * @param {Object} options - Additional options
 */
export function sendNotification(title, message, type = 'info', options = {}) {
    // Add to notification history
    addNotificationToHistory(title, message, type);
    
    // Send browser notification if permission granted
    if (Notification.permission === 'granted') {
        sendBrowserNotification(title, message, type);
    }
    
    // Update badge count
    updateNotificationBadge();
    
    // Show toast notification if specified
    if (options.showToast) {
        showToast(message, type);
    }
}

/**
 * Send a browser notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} type - Notification type
 */
function sendBrowserNotification(title, body, type) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    
    // Set icon based on type
    let icon = 'images/logo.svg';
    
    // Create notification
    const notification = new Notification(title, {
        body: body,
        icon: icon,
        tag: 'partnerpayz-notification'
    });
    
    // Handle notification click
    notification.onclick = () => {
        window.focus();
        notification.close();
        window.location.href = 'notifications.html';
    };
    
    // Auto close after 5 seconds
    setTimeout(() => {
        notification.close();
    }, 5000);
}

/**
 * Add notification to history in localStorage
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
function addNotificationToHistory(title, message, type) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get existing notifications
    const notifications = getNotifications();
    
    // Create notification object
    const notification = {
        id: 'notif_' + Date.now(),
        userId: currentUser.id,
        title: title,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        type: type
    };
    
    // Add to notifications list
    notifications.unshift(notification); // Add to beginning of array
    
    // Limit to 50 notifications per user
    const userNotifications = notifications.filter(n => n.userId === currentUser.id);
    if (userNotifications.length > 50) {
        // Get IDs of notifications to keep
        const idsToKeep = userNotifications
            .slice(0, 50)
            .map(n => n.id);
            
        // Filter all notifications to keep only those IDs for this user, and all other users' notifications
        const trimmedNotifications = notifications.filter(n => 
            n.userId !== currentUser.id || idsToKeep.includes(n.id)
        );
        
        // Save trimmed list
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmedNotifications));
    } else {
        // Save full list
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
}

/**
 * Get notifications from localStorage
 * @returns {Array} Array of notification objects
 */
export function getNotifications() {
    try {
        const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
        return notificationsJson ? JSON.parse(notificationsJson) : [];
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
}

/**
 * Get unread notification count for current user
 * @returns {number} Count of unread notifications
 */
export function getUnreadCount() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;
    
    const notifications = getNotifications();
    return notifications.filter(n => 
        n.userId === currentUser.id && !n.read
    ).length;
}

/**
 * Update notification badge with unread count
 */
export function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const count = getUnreadCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

/**
 * Mark notification as read
 * @param {string} notificationId - ID of notification to mark as read
 */
export function markAsRead(notificationId) {
    const notifications = getNotifications();
    
    // Update notification read status
    const updatedNotifications = notifications.map(n => {
        if (n.id === notificationId) {
            return { ...n, read: true };
        }
        return n;
    });
    
    // Save updated notifications
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    
    // Update badge
    updateNotificationBadge();
}

/**
 * Mark all notifications as read for current user
 */
export function markAllAsRead() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const notifications = getNotifications();
    
    // Update all notifications for current user
    const updatedNotifications = notifications.map(n => {
        if (n.userId === currentUser.id) {
            return { ...n, read: true };
        }
        return n;
    });
    
    // Save updated notifications
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    
    // Update badge
    updateNotificationBadge();
}

/**
 * Delete notification by ID
 * @param {string} notificationId - ID of notification to delete
 */
export function deleteNotification(notificationId) {
    const notifications = getNotifications();
    
    // Filter out notification with matching ID
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    
    // Save updated notifications
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    
    // Update badge
    updateNotificationBadge();
}

/**
 * Delete all notifications for current user
 */
export function deleteAllNotifications() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const notifications = getNotifications();
    
    // Filter out all notifications for current user
    const updatedNotifications = notifications.filter(n => n.userId !== currentUser.id);
    
    // Save updated notifications
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    
    // Update badge
    updateNotificationBadge();
}

/**
 * Create notification item element
 * @param {Object} notification - Notification object
 * @returns {HTMLElement} Notification item element
 */
export function createNotificationItem(notification) {
    const item = document.createElement('div');
    item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
    item.dataset.id = notification.id;
    
    // Set icon based on type
    let iconClass = 'fas fa-info-circle';
    if (notification.type === 'success') iconClass = 'fas fa-check-circle';
    if (notification.type === 'warning') iconClass = 'fas fa-exclamation-triangle';
    if (notification.type === 'error') iconClass = 'fas fa-exclamation-circle';
    
    // Format date
    const date = new Date(notification.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    item.innerHTML = `
        <div class="notification-icon ${notification.type}">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <h3 class="notification-title">${notification.title}</h3>
            <p class="notification-message">${notification.message}</p>
            <p class="notification-time">${formattedDate}, ${formattedTime}</p>
        </div>
        <div class="notification-actions">
            <button class="mark-btn" title="${notification.read ? 'Mark as unread' : 'Mark as read'}">
                <i class="${notification.read ? 'far fa-envelope' : 'fas fa-envelope-open'}"></i>
            </button>
            <button class="delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const markBtn = item.querySelector('.mark-btn');
    markBtn.addEventListener('click', () => {
        markAsRead(notification.id);
        item.classList.add('read');
        item.classList.remove('unread');
        markBtn.innerHTML = '<i class="far fa-envelope"></i>';
        markBtn.title = 'Mark as unread';
    });
    
    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteNotification(notification.id);
        item.remove();
    });
    
    return item;
}

/**
 * Get current user from localStorage
 * @returns {Object|null} Current user object or null if not logged in
 */
function getCurrentUser() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return null;
    
    const users = getUsers();
    return users.find(u => u.id === currentUserId);
}

/**
 * Get users from localStorage
 * @returns {Array} Array of user objects
 */
function getUsers() {
    try {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 
                   type === 'error' ? 'fas fa-exclamation-circle' : 
                   type === 'warning' ? 'fas fa-exclamation-triangle' :
                   'fas fa-info-circle';
    
    const content = document.createElement('span');
    content.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(content);
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
} 