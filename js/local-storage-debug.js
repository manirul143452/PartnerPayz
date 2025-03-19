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
        // Check users data
        try {
            const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
            if (usersJSON) {
                JSON.parse(usersJSON); // Will throw error if invalid JSON
            } else {
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
                console.log('Created empty users array');
            }
        } catch (e) {
            // Invalid JSON, reset it
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
            console.log('Fixed corrupted users data');
        }
        
        // Check current user data
        try {
            const currentUserJSON = localStorage.getItem(CURRENT_USER_KEY);
            if (currentUserJSON) {
                JSON.parse(currentUserJSON); // Will throw error if invalid JSON
            }
        } catch (e) {
            // Invalid JSON, reset it
            localStorage.removeItem(CURRENT_USER_KEY);
            console.log('Removed corrupted current user data');
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