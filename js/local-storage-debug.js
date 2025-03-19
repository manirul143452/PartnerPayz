/**
 * LocalStorage Debug Utilities
 * This file provides debugging tools for localStorage data
 */

// Constants for storage keys
const USERS_STORAGE_KEY = 'partnerpayz_users';
const CURRENT_USER_KEY = 'partnerpayz_current_user';

// Check if a key exists in localStorage
export function checkKeyExists(key) {
    try {
        return localStorage.getItem(key) !== null;
    } catch (error) {
        console.error(`Error checking if key '${key}' exists:`, error);
        return false;
    }
}

// Display all user data in the console (for debugging)
export function displayAllUsers() {
    try {
        const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
        if (!usersJSON) {
            console.log('No users found in localStorage');
            return [];
        }
        
        const users = JSON.parse(usersJSON);
        console.log('All users:', users);
        return users;
    } catch (error) {
        console.error('Error displaying all users:', error);
        return [];
    }
}

// Display current user data in the console (for debugging)
export function displayCurrentUser() {
    try {
        const userJSON = localStorage.getItem(CURRENT_USER_KEY);
        if (!userJSON) {
            console.log('No current user found in localStorage');
            return null;
        }
        
        const user = JSON.parse(userJSON);
        console.log('Current user:', user);
        return user;
    } catch (error) {
        console.error('Error displaying current user:', error);
        return null;
    }
}

// Reset user data (for debugging)
export function resetUserData() {
    try {
        localStorage.removeItem(USERS_STORAGE_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        console.log('User data has been reset');
        return true;
    } catch (error) {
        console.error('Error resetting user data:', error);
        return false;
    }
}

// Fix corrupted user data (creates empty users array if missing or corrupted)
export function fixUserData() {
    try {
        // Check if users array exists and is valid JSON
        const usersJson = localStorage.getItem('users');
        if (usersJson) {
            try {
                const users = JSON.parse(usersJson);
                
                // Check if it's actually an array
                if (!Array.isArray(users)) {
                    console.warn('Users data is not an array, resetting to empty array');
                    localStorage.setItem('users', JSON.stringify([]));
                }
            } catch (e) {
                console.error('Failed to parse users JSON, resetting to empty array', e);
                localStorage.setItem('users', JSON.stringify([]));
            }
        } else {
            // Initialize users array if it doesn't exist
            localStorage.setItem('users', JSON.stringify([]));
        }
        
        // Check if current user ID exists and is valid
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
            const usersJson = localStorage.getItem('users');
            const users = JSON.parse(usersJson);
            
            // Check if the user with this ID exists
            const userExists = users.some(user => user.id === currentUserId);
            if (!userExists) {
                console.warn('Current user ID does not exist in users array, removing current user ID');
                localStorage.removeItem('currentUserId');
            }
        }
        
        // Check if notifications array exists and is valid JSON
        const notificationsJson = localStorage.getItem('partnerpayz_notifications');
        if (notificationsJson) {
            try {
                const notifications = JSON.parse(notificationsJson);
                
                // Check if it's actually an array
                if (!Array.isArray(notifications)) {
                    console.warn('Notifications data is not an array, resetting to empty array');
                    localStorage.setItem('partnerpayz_notifications', JSON.stringify([]));
                }
            } catch (e) {
                console.error('Failed to parse notifications JSON, resetting to empty array', e);
                localStorage.setItem('partnerpayz_notifications', JSON.stringify([]));
            }
        } else {
            // Initialize notifications array if it doesn't exist
            localStorage.setItem('partnerpayz_notifications', JSON.stringify([]));
        }
        
        return true;
    } catch (error) {
        console.error('Error fixing user data:', error);
        return false;
    }
}

// Get localStorage usage information
export function getStorageInfo() {
    try {
        let totalSize = 0;
        let items = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = (key.length + value.length) * 2; // Rough estimate in bytes (UTF-16)
            totalSize += size;
            items++;
        }
        
        return {
            items,
            totalSize: (totalSize / 1024).toFixed(2) + ' KB',
            limit: '5 MB (typical browser limit)',
            percentUsed: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
}

// Automatically fix data on load
fixUserData(); 

// Display all users in the console (for debugging)
export function displayAllUsers() {
    try {
        const usersJson = localStorage.getItem('users');
        if (!usersJson) {
            console.log('No users found in localStorage');
            return [];
        }
        
        const users = JSON.parse(usersJson);
        
        if (!Array.isArray(users)) {
            console.log('Users data is not an array');
            return [];
        }
        
        if (users.length === 0) {
            console.log('No users found (empty array)');
            return [];
        }
        
        console.log(`Found ${users.length} users:`);
        users.forEach((user, index) => {
            // Don't log the password
            const { password, ...userWithoutPassword } = user;
            console.log(`User ${index + 1}:`, userWithoutPassword);
        });
        
        return users.map(({ password, ...user }) => user);
    } catch (error) {
        console.error('Error displaying users:', error);
        return [];
    }
}

// Verify localStorage is working correctly
export function verifyLocalStorage() {
    try {
        // Try to write to localStorage
        localStorage.setItem('partnerpayz_test', 'test');
        
        // Try to read from localStorage
        const testValue = localStorage.getItem('partnerpayz_test');
        
        // Clean up
        localStorage.removeItem('partnerpayz_test');
        
        // Check if the value was written and read correctly
        return testValue === 'test';
    } catch (error) {
        console.error('LocalStorage test failed:', error);
        return false;
    }
}

// Get total localStorage usage
export function getLocalStorageUsage() {
    try {
        let totalSize = 0;
        
        // Iterate over all localStorage items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            
            // Calculate size in bytes
            const size = (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
            
            totalSize += size;
        }
        
        // Convert to KB
        const sizeInKB = totalSize / 1024;
        
        return {
            bytes: totalSize,
            kilobytes: sizeInKB,
            items: localStorage.length
        };
    } catch (error) {
        console.error('Error calculating localStorage usage:', error);
        return {
            bytes: 0,
            kilobytes: 0,
            items: 0
        };
    }
}

// Clear all app data (dangerous!)
export function clearAllAppData() {
    try {
        localStorage.removeItem('users');
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('partnerpayz_notifications');
        
        return true;
    } catch (error) {
        console.error('Error clearing app data:', error);
        return false;
    }
} 