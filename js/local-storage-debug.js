/**
 * PartnerPayz localStorage Debug Utilities
 * This file contains utility functions for diagnosing and fixing localStorage issues
 */

// Storage keys
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUserId';
const NOTIFICATIONS_KEY = 'notifications';

/**
 * Verifies if localStorage is working correctly
 * @returns {boolean} True if localStorage is working, false otherwise
 */
export function verifyLocalStorage() {
    try {
        // Test if localStorage is available
        const testKey = 'partnerPayzTest';
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        // If we successfully stored and retrieved the value, localStorage is working
        return value === 'test';
    } catch (error) {
        console.error('localStorage test failed:', error);
        return false;
    }
}

/**
 * Displays all users in localStorage in the console
 */
export function displayAllUsers() {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        if (!usersJson) {
            console.log('No users found in localStorage');
            return [];
        }
        
        const users = JSON.parse(usersJson);
        console.table(users);
        
        // Also display current user
        const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
        console.log('Current user ID:', currentUserId);
        
        if (currentUserId) {
            const currentUser = users.find(user => user.id === currentUserId);
            console.log('Current user:', currentUser);
        }
        
        return users;
    } catch (error) {
        console.error('Error displaying users:', error);
        return [];
    }
}

/**
 * Fixes potential issues with user data in localStorage
 */
export function fixUserData() {
    try {
        // Get users data
        let usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        if (!usersJson) {
            // Initialize users array if not exists
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
            console.log('Users array initialized');
            return;
        }
        
        // Parse users data
        let users;
        try {
            users = JSON.parse(usersJson);
            if (!Array.isArray(users)) {
                // If users is not an array, reset it
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
                console.log('Reset users to empty array');
                return;
            }
        } catch (error) {
            // If JSON parse fails, reset users
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
            console.log('Reset users due to parse error:', error);
            return;
        }
        
        // Validate current user ID
        const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserId) {
            // Check if current user exists in users array
            const currentUserExists = users.some(user => user.id === currentUserId);
            if (!currentUserExists) {
                // Remove invalid current user ID
                console.log('Removing invalid currentUserId:', currentUserId);
                localStorage.removeItem(CURRENT_USER_KEY);
            }
        }
        
        // Validate each user object
        let modified = false;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            // Ensure user has essential properties
            if (!user.id || !user.email || !user.password) {
                // Remove invalid user
                users.splice(i, 1);
                i--; // Adjust index after removal
                modified = true;
                console.log('Removed invalid user object:', user);
            }
        }
        
        // Save changes if necessary
        if (modified) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            console.log('User data fixed');
        }
    } catch (error) {
        console.error('Error fixing user data:', error);
    }
}

/**
 * Creates a test user for debugging
 * @returns {Object} Created test user
 */
export function createTestUser() {
    try {
        // Get users data
        let usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        let users = [];
        if (usersJson) {
            try {
                users = JSON.parse(usersJson);
            } catch (error) {
                users = [];
            }
        }
        
        // If users is not an array, reset it
        if (!Array.isArray(users)) {
            users = [];
        }
        
        // Create test user
        const testUser = {
            id: 'test-' + Date.now(),
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            createdAt: new Date().toISOString()
        };
        
        // Check if test user already exists
        const existingTestUser = users.find(user => user.email === testUser.email);
        if (existingTestUser) {
            // Set current user to existing test user
            localStorage.setItem(CURRENT_USER_KEY, existingTestUser.id);
            console.log('Using existing test user:', existingTestUser);
            return existingTestUser;
        }
        
        // Add test user
        users.push(testUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Set current user
        localStorage.setItem(CURRENT_USER_KEY, testUser.id);
        
        console.log('Created and logged in test user:', testUser);
        return testUser;
    } catch (error) {
        console.error('Error creating test user:', error);
        return null;
    }
}

/**
 * Clears all app data from localStorage
 */
export function clearAllData() {
    try {
        // Clear all app-related keys
        localStorage.removeItem(USERS_STORAGE_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(NOTIFICATIONS_KEY);
        
        console.log('All app data cleared from localStorage');
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}

/**
 * Displays localStorage usage information
 * @returns {Object} Storage usage information
 */
export function getStorageInfo() {
    try {
        const info = {
            total: 0,
            used: 0,
            available: 5 * 1024 * 1024, // 5MB typical limit
            items: []
        };
        
        // Calculate total usage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
            
            info.total += size;
            info.items.push({
                key,
                size: size,
                sizeFormatted: `${(size / 1024).toFixed(2)} KB`
            });
        }
        
        info.used = info.total;
        info.usedFormatted = `${(info.used / 1024).toFixed(2)} KB`;
        info.availableFormatted = `${(info.available / 1024).toFixed(2)} KB`;
        info.percentUsed = ((info.used / info.available) * 100).toFixed(2) + '%';
        
        console.table(info.items);
        console.log(`Total localStorage usage: ${info.usedFormatted} / ${info.availableFormatted} (${info.percentUsed})`);
        
        return info;
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
} 