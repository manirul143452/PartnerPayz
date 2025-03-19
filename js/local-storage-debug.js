/**
 * PartnerPayz Local Storage Debug Module
 * Provides utilities for debugging and fixing localStorage issues
 */

// Constants for storage keys
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUserId';
const MESSAGES_KEY = 'messages';
const NOTIFICATIONS_KEY = 'notifications';

/**
 * Verify localStorage is working correctly
 * @returns {boolean} True if localStorage is working
 */
export function verifyLocalStorage() {
    try {
        const testKey = 'partnerpayz_test';
        localStorage.setItem(testKey, 'test');
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        console.log('LocalStorage test complete:', testValue === 'test' ? 'PASSED' : 'FAILED');
        return testValue === 'test';
    } catch (error) {
        console.error('LocalStorage error:', error);
        return false;
    }
}

/**
 * Fix user data issues in localStorage
 * @returns {boolean} True if fixed successfully
 */
export function fixUserData() {
    try {
        console.log('Starting user data fix process...');
        
        // Check users data
        let users = [];
        try {
            const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
            console.log('Current users JSON:', usersJson ? `Found (${usersJson.length} bytes)` : 'None');
            
            if (usersJson) {
                users = JSON.parse(usersJson);
                console.log(`Parsed ${users.length} users from localStorage`);
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
            console.log('Resetting user data due to parsing error');
            users = [];
        }
        
        // Ensure users is an array
        if (!Array.isArray(users)) {
            console.error('Users is not an array, resetting');
            users = [];
        }
        
        // Check if users array is valid
        if (users.length === 0) {
            console.log('No users found, creating demo user');
            
            // Create demo user
            const demoUser = {
                id: 'demo_user_' + Date.now(),
                email: 'demo@example.com',
                password: 'password123',
                name: 'Demo User',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            users.push(demoUser);
            console.log('Added demo user:', demoUser.email);
        }
        
        // Save users
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        console.log(`Saved ${users.length} users to localStorage`);
        
        // Check current user
        const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
        console.log('Current user ID:', currentUserId || 'None');
        
        if (currentUserId) {
            const currentUser = users.find(u => u.id === currentUserId);
            if (!currentUser) {
                console.warn('Current user ID does not match any user, clearing');
                localStorage.removeItem(CURRENT_USER_KEY);
            } else {
                console.log('Current user is valid:', currentUser.email);
            }
        }
        
        // Check messages
        let messages = [];
        try {
            const messagesJson = localStorage.getItem(MESSAGES_KEY);
            if (messagesJson) {
                messages = JSON.parse(messagesJson);
                console.log(`Found ${messages.length} messages in localStorage`);
            }
        } catch (e) {
            console.error('Error parsing messages:', e);
            messages = [];
        }
        
        // Ensure messages is an array
        if (!Array.isArray(messages)) {
            console.error('Messages is not an array, resetting');
            messages = [];
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        }
        
        // Check notifications
        let notifications = [];
        try {
            const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
            if (notificationsJson) {
                notifications = JSON.parse(notificationsJson);
                console.log(`Found ${notifications.length} notifications in localStorage`);
            }
        } catch (e) {
            console.error('Error parsing notifications:', e);
            notifications = [];
        }
        
        // Ensure notifications is an array
        if (!Array.isArray(notifications)) {
            console.error('Notifications is not an array, resetting');
            notifications = [];
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
        }
        
        console.log('User data fix process complete');
        return true;
    } catch (error) {
        console.error('Error fixing user data:', error);
        return false;
    }
}

/**
 * Create a test user for debugging
 * @returns {Object} Created user object
 */
export function createTestUser() {
    try {
        // Generate a unique ID for the test user
        const testUserId = 'test_user_' + Date.now();
        
        // Create test user object
        const testUser = {
            id: testUserId,
            email: 'test@example.com',
            password: 'password123', // In a real app, this would be hashed
            name: 'Test User',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        // Get existing users
        let users = [];
        try {
            const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
            if (usersJson) {
                users = JSON.parse(usersJson);
            }
        } catch (e) {
            console.error('Error parsing users, resetting');
            users = [];
        }
        
        // Ensure users is an array
        if (!Array.isArray(users)) {
            console.error('Users is not an array, resetting');
            users = [];
        }
        
        // Remove any existing test user
        users = users.filter(u => u.email !== 'test@example.com');
        
        // Add new test user
        users.push(testUser);
        
        // Save users
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Set current user
        localStorage.setItem(CURRENT_USER_KEY, testUserId);
        
        console.log('Created test user:', testUser.email);
        
        // Create sample data for the test user
        createSampleData(testUserId);
        
        return testUser;
    } catch (error) {
        console.error('Error creating test user:', error);
        return null;
    }
}

/**
 * Create sample data for testing
 * @param {string} userId - User ID to create data for
 */
function createSampleData(userId) {
    try {
        // Create sample messages
        let messages = [];
        try {
            const messagesJson = localStorage.getItem(MESSAGES_KEY);
            if (messagesJson) {
                messages = JSON.parse(messagesJson);
            }
        } catch (e) {
            console.error('Error parsing messages, resetting');
            messages = [];
        }
        
        // Ensure messages is an array
        if (!Array.isArray(messages)) {
            messages = [];
        }
        
        // Create sample notifications
        let notifications = [];
        try {
            const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
            if (notificationsJson) {
                notifications = JSON.parse(notificationsJson);
            }
        } catch (e) {
            console.error('Error parsing notifications, resetting');
            notifications = [];
        }
        
        // Ensure notifications is an array
        if (!Array.isArray(notifications)) {
            notifications = [];
        }
        
        // Add sample notification
        notifications.push({
            id: 'notif_' + Date.now(),
            userId: userId,
            title: 'Welcome to PartnerPayz',
            message: 'Thank you for trying out our application. This is a sample notification.',
            timestamp: new Date().toISOString(),
            read: false,
            type: 'info'
        });
        
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
        console.log('Added sample notification');
        
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

/**
 * Display all users from localStorage (for debugging)
 * @returns {Array} Array of users
 */
export function displayAllUsers() {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        if (!usersJson) {
            console.log('No users found in localStorage');
            return [];
        }
        
        const users = JSON.parse(usersJson);
        
        console.log('=== All Users ===');
        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`- ID: ${user.id}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Name: ${user.name || 'N/A'}`);
            console.log(`- Created: ${new Date(user.createdAt).toLocaleString()}`);
            console.log(`- Last Login: ${new Date(user.lastLogin).toLocaleString()}`);
            console.log('---');
        });
        
        return users;
    } catch (error) {
        console.error('Error displaying users:', error);
        return [];
    }
}

/**
 * Clear all application data from localStorage
 */
export function clearAllData() {
    try {
        console.log('Clearing all application data...');
        
        localStorage.removeItem(USERS_STORAGE_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(MESSAGES_KEY);
        localStorage.removeItem(NOTIFICATIONS_KEY);
        
        console.log('All application data cleared successfully');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

// Auto-fix on page load
(function() {
    // Verify localStorage is working
    const isLocalStorageWorking = verifyLocalStorage();
    
    if (!isLocalStorageWorking) {
        console.error('LocalStorage is not working!');
        return;
    }
    
    // Fix user data if needed
    fixUserData();
})(); 