/**
 * PartnerPayz Local Authentication Module
 * Handles user registration, login, logout, and session management using localStorage
 */

// Generate a unique ID for users
function generateUniqueId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// Register a new user
export async function registerUser(email, password, name = '') {
    try {
        // Check if user already exists
        const users = getAllUsers();
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
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
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as current user
        localStorage.setItem('currentUserId', userId);
        
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
        const users = getAllUsers();
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (!user) {
            return { 
                success: false, 
                error: 'Invalid email or password' 
            };
        }
        
        // Update last login time
        user.lastLogin = new Date().toISOString();
        updateUser(user);
        
        // Set as current user
        localStorage.setItem('currentUserId', user.id);
        
        return { 
            success: true, 
            user: { ...user, password: undefined } // Remove password from returned user
        };
    } catch (error) {
        console.error('Login error:', error);
        return { 
            success: false, 
            error: 'Failed to log in. Please try again.' 
        };
    }
}

// Login with Google (simulated)
export async function loginWithGoogle() {
    try {
        // Generate fake Google account info
        const randomNum = Math.floor(Math.random() * 1000);
        const email = `user${randomNum}@gmail.com`;
        const name = `Google User ${randomNum}`;
        
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
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            // Update last login time
            user.lastLogin = new Date().toISOString();
            updateUser(user);
        }
        
        // Set as current user
        localStorage.setItem('currentUserId', user.id);
        
        return { 
            success: true, 
            user: { ...user, password: undefined } // Remove password from returned user
        };
    } catch (error) {
        console.error('Google login error:', error);
        return { 
            success: false, 
            error: 'Failed to log in with Google. Please try again.' 
        };
    }
}

// Log out current user
export async function logoutUser() {
    try {
        localStorage.removeItem('currentUserId');
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
    const currentUserId = localStorage.getItem('currentUserId');
    return !!currentUserId && !!getCurrentUser();
}

// Get current user data
export function getCurrentUser() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return null;
    
    const users = getAllUsers();
    const user = users.find(u => u.id === currentUserId);
    
    if (!user) {
        // Clean up if user ID is invalid
        localStorage.removeItem('currentUserId');
        return null;
    }
    
    return { ...user, password: undefined }; // Remove password from returned user
}

// Update user data
export function updateUser(userData) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userData.id);
    
    if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    
    return false;
}

// Get all users (helper function)
export function getAllUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
} 