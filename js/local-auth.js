/**
 * PartnerPayz Local Authentication Module
 * Handles user registration, login, logout, and session management using localStorage
 */

// Constants for storage
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUserId';

// Generate a unique ID for users
function generateUniqueId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// Register a new user
export async function registerUser(email, password, name = '') {
    try {
        console.log('Registering new user:', email);
        
        // Check if user already exists
        const users = getAllUsers();
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
            console.warn('Registration failed: Email already exists');
            return { 
                success: false, 
                error: 'A user with this email already exists' 
            };
        }
        
        // Create new user object
        const userId = generateUniqueId();
        const user = {
            id: userId,
            email: email,
            name: name || email.split('@')[0],
            password: password, // In a real app, this should be hashed
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        // Add to users array
        users.push(user);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Set as current user
        localStorage.setItem(CURRENT_USER_KEY, userId);
        console.log('User registered successfully. ID:', userId);
        
        return { 
            success: true, 
            user: { ...user, password: undefined } // Remove password from returned user
        };
    } catch (error) {
        console.error('Registration error:', error);
        return { 
            success: false, 
            error: 'Failed to register user. Please try again.' 
        };
    }
}

// Log in with email and password
export async function loginUser(email, password) {
    try {
        console.log('Attempting login for:', email);
        
        const users = getAllUsers();
        console.log('Found', users.length, 'users in storage');
        
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (!user) {
            console.warn('Login failed: Invalid credentials');
            return null;
        }
        
        // Update last login time
        user.lastLogin = new Date().toISOString();
        updateUser(user);
        
        // Set as current user
        localStorage.setItem(CURRENT_USER_KEY, user.id);
        console.log('Login successful. User ID:', user.id);
        
        // Return user without password
        return { ...user, password: undefined };
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

// Login with Google (simulated)
export async function googleLogin() {
    try {
        // Generate fake Google account info
        const randomNum = Math.floor(Math.random() * 1000);
        const email = `user${randomNum}@gmail.com`;
        const name = `Google User ${randomNum}`;
        
        console.log('Simulating Google login for:', email);
        
        // Check if this Google user already exists
        const users = getAllUsers();
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            // Create new user if doesn't exist
            const userId = generateUniqueId();
            user = {
                id: userId,
                email: email,
                name: name,
                password: null, // Google users don't have passwords
                isGoogleUser: true,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            users.push(user);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            console.log('Created new Google user. ID:', userId);
        } else {
            // Update last login time
            user.lastLogin = new Date().toISOString();
            updateUser(user);
            console.log('Google user exists, updated last login time');
        }
        
        // Set as current user
        localStorage.setItem(CURRENT_USER_KEY, user.id);
        console.log('Google login successful. User ID:', user.id);
        
        // Return user without password
        return { ...user, password: undefined };
    } catch (error) {
        console.error('Google login error:', error);
        return null;
    }
}

// Log out current user
export async function logoutUser() {
    try {
        const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
        console.log('Logging out user:', currentUserId);
        
        localStorage.removeItem(CURRENT_USER_KEY);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { 
            success: false, 
            error: 'Failed to log out. Please try again.' 
        };
    }
}

// Check if user is logged in
export function isLoggedIn() {
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
    const isLoggedIn = !!currentUserId && !!getCurrentUser();
    console.log('Checking login status:', isLoggedIn ? 'Logged in' : 'Not logged in', 'User ID:', currentUserId);
    return isLoggedIn;
}

// Get current user data
export function getCurrentUser() {
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserId) {
        console.log('No current user ID found');
        return null;
    }
    
    const users = getAllUsers();
    const user = users.find(u => u.id === currentUserId);
    
    if (!user) {
        // Clean up if user ID is invalid
        console.warn('User ID exists but user not found, removing invalid ID');
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
    }
    
    console.log('Current user retrieved:', user.name || user.email);
    return { ...user, password: undefined }; // Remove password from returned user
}

// Update user data
export function updateUser(userData) {
    try {
        const users = getAllUsers();
        const index = users.findIndex(u => u.id === userData.id);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            console.log('User updated:', userData.id);
            return true;
        }
        
        console.warn('User update failed: User not found', userData.id);
        return false;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
}

// Get all users (helper function)
export function getAllUsers() {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        const users = usersJson ? JSON.parse(usersJson) : [];
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
} 