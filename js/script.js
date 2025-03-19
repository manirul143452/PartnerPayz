/**
 * PartnerPayz - Main JavaScript File
 * Handles user authentication, profile management, and UI interactions
 */

// Global state management
const appState = {
    isMenuOpen: false,
    currentTheme: localStorage.getItem('theme') || 'light'
};

// DOM Elements - Will be initialized when DOM is loaded
let elements = {};

/**
 * Initialize the application
 */
function initApp() {
    // Initialize DOM elements
    cacheElements();
    
    // Apply theme
    applyTheme(appState.currentTheme);
    
    // Setup event listeners
    setupEventListeners();
    
    // Check login status and update UI
    updateUIBasedOnAuthState();
    
    // Initialize mobile menu
    initMobileMenu();
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
    elements = {
        // Main navigation
        navLogoutBtn: document.getElementById('navLogoutBtn'),
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        mobileMenu: document.querySelector('.main-nav'),
        
        // User profile elements
        userProfileMenu: document.getElementById('userProfileMenu'),
        usernameDisplay: document.getElementById('usernameDisplay'),
        headerAvatar: document.getElementById('headerAvatar'),
        notificationBadge: document.getElementById('notificationBadge'),
        
        // Toast container
        toastContainer: document.getElementById('toastContainer')
    };
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Handle logout click
    if (elements.navLogoutBtn) {
        elements.navLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (appState.isMenuOpen && 
            !e.target.closest('.mobile-menu-toggle') && 
            !e.target.closest('.main-nav')) {
            toggleMobileMenu();
        }
    });
    
    // Handle theme toggle if exists
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Handle user logout
 */
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        // If using the import syntax with local-auth.js
        if (typeof logoutUser === 'function') {
            await logoutUser();
        } else {
            // Fallback implementation
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
        }
        
        showToast('Logged out successfully!', 'success');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        showToast('Failed to log out', 'error');
        console.error('Logout error:', error);
    }
}

/**
 * Update UI based on authentication state
 */
function updateUIBasedOnAuthState() {
    // Check if user is logged in
    const isUserLoggedIn = checkIsLoggedIn();
    
    // Update navigation
    if (elements.navLogoutBtn) {
        elements.navLogoutBtn.parentElement.style.display = isUserLoggedIn ? 'block' : 'none';
    }
    
    // Update profile information if on profile page
    if (isUserLoggedIn && window.location.pathname.includes('profile.html')) {
        updateProfilePage();
    }
    
    // Update notification badge
    updateNotificationBadge();
}

/**
 * Check if user is logged in
 */
function checkIsLoggedIn() {
    // Try to use the imported function first
    if (typeof isLoggedIn === 'function') {
        return isLoggedIn();
    }
    
    // Fallback: Check localStorage directly
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Get current user data
 */
function getCurrentUser() {
    // Try to use the imported function first
    if (typeof getCurrentUser === 'function') {
        return getCurrentUser();
    }
    
    // Fallback: Get from localStorage
    try {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Update profile page with user data
 */
function updateProfilePage() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Could not load user profile', 'error');
        return;
    }
    
    // Update profile elements if they exist
    const profileElements = {
        profileFullName: document.getElementById('profileFullName'),
        profileMembership: document.getElementById('profileMembership'),
        profileUserId: document.getElementById('profileUserId'),
        profileAvatarLarge: document.getElementById('profileAvatarLarge'),
        profileEmail: document.getElementById('profileEmail'),
        profileJoinDate: document.getElementById('profileJoinDate'),
        profileStatus: document.getElementById('profileStatus')
    };
    
    // Update profile header
    if (profileElements.profileFullName) {
        profileElements.profileFullName.textContent = user.name || user.email.split('@')[0];
    }
    if (elements.usernameDisplay) {
        elements.usernameDisplay.textContent = user.name || user.email.split('@')[0];
    }
    if (profileElements.profileUserId) {
        profileElements.profileUserId.textContent = user.id || 'N/A';
    }
    
    // Set membership level based on account age
    if (profileElements.profileMembership && user.createdAt) {
        const accountAge = new Date() - new Date(user.createdAt);
        const daysSinceCreation = Math.floor(accountAge / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreation > 90) {
            profileElements.profileMembership.textContent = 'Gold Member';
        } else if (daysSinceCreation > 30) {
            profileElements.profileMembership.textContent = 'Silver Member';
        } else {
            profileElements.profileMembership.textContent = 'New Member';
        }
    }
    
    // Update account info
    if (profileElements.profileEmail) {
        profileElements.profileEmail.textContent = user.email || 'N/A';
    }
    
    if (profileElements.profileJoinDate && user.createdAt) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        profileElements.profileJoinDate.textContent = new Date(user.createdAt).toLocaleDateString(undefined, options);
    }
    
    if (profileElements.profileStatus) {
        profileElements.profileStatus.textContent = 'Active';
    }
    
    // Update avatars with Gravatar or a placeholder
    if (user.email) {
        const hash = generateMD5Hash(user.email.trim().toLowerCase());
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
        
        if (profileElements.profileAvatarLarge) {
            profileElements.profileAvatarLarge.src = gravatarUrl;
        }
        if (elements.headerAvatar) {
            elements.headerAvatar.src = gravatarUrl;
        }
    }
}

/**
 * Simple MD5 hash simulation for Gravatar
 */
function generateMD5Hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

/**
 * Update notification badge count
 */
function updateNotificationBadge() {
    if (!elements.notificationBadge) return;
    
    // Get notifications from localStorage
    try {
        const notifications = getNotifications();
        const unreadCount = notifications.filter(notification => !notification.read).length;
        
        // Update badge
        elements.notificationBadge.textContent = unreadCount.toString();
        elements.notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    } catch (error) {
        console.error('Error updating notification badge:', error);
    }
}

/**
 * Get notifications from localStorage
 */
function getNotifications() {
    try {
        const notificationsData = localStorage.getItem('notifications');
        return notificationsData ? JSON.parse(notificationsData) : [];
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    if (!elements.mobileMenuToggle || !elements.mobileMenu) return;
    
    // Set initial state
    appState.isMenuOpen = false;
    elements.mobileMenu.style.display = 'none';
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    if (!elements.mobileMenu) return;
    
    appState.isMenuOpen = !appState.isMenuOpen;
    elements.mobileMenu.style.display = appState.isMenuOpen ? 'flex' : 'none';
    
    // Toggle active class on menu button
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.classList.toggle('active');
    }
}

/**
 * Toggle theme between light and dark
 */
function toggleTheme() {
    const newTheme = appState.currentTheme === 'light' ? 'dark' : 'light';
    appState.currentTheme = newTheme;
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    applyTheme(newTheme);
}

/**
 * Apply theme to the document
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle button if exists
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    if (!elements.toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        elements.toastContainer = container;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 
                   type === 'error' ? 'fas fa-exclamation-circle' : 
                   'fas fa-info-circle';
    
    const content = document.createElement('span');
    content.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(content);
    elements.toastContainer.appendChild(toast);
    
    // Animate toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (elements.toastContainer.contains(toast)) {
                elements.toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Expose functions for global use
window.showToast = showToast;
window.updateNotificationBadge = updateNotificationBadge; 