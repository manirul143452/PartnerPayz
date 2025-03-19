// Simple user authentication system using localStorage
// This is a robust implementation that ensures data persistence

// User storage keys
const USERS_STORAGE_KEY = 'partnerpayz_users';
const CURRENT_USER_KEY = 'partnerpayz_current_user';

// Initialize users if not exists
function initUsers() {
    try {
        if (!localStorage.getItem(USERS_STORAGE_KEY)) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        }
        return true;
    } catch (error) {
        console.error('Error initializing users in localStorage:', error);
        return false;
    }
}

// Get all users with error handling
function getUsers() {
    try {
        initUsers();
        const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
        if (!usersJSON) return [];
        
        const users = JSON.parse(usersJSON);
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error('Error getting users from localStorage:', error);
        return [];
    }
}

// Save users with error handling
function saveUsers(users) {
    try {
        if (!Array.isArray(users)) {
            throw new Error('Users must be an array');
        }
        
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users to localStorage:', error);
        return false;
    }
}

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Register a new user
export async function registerUser(email, password, name) {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
        return { success: false, error: 'Local storage is not available in your browser' };
    }
    
    // Basic validation
    if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
    }

    const users = getUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return { success: false, error: 'User already exists' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, you would hash this password
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    const saveResult = saveUsers(users);
    
    if (!saveResult) {
        return { success: false, error: 'Failed to save user data' };
    }
    
    // Auto login - without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Save current user
    try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
        console.error('Error saving current user to localStorage:', error);
        return { success: false, error: 'Failed to save session data' };
    }
    
    return { success: true, user: userWithoutPassword };
}

// Login user
export async function loginUser(email, password) {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
        return { success: false, error: 'Local storage is not available in your browser' };
    }
    
    const users = getUsers();
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        return { success: false, error: 'Invalid email or password' };
    }
    
    // Don't send password to client
    const { password: _, ...userWithoutPassword } = user;
    
    // Save current user
    try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } catch (error) {
        console.error('Error saving current user to localStorage:', error);
        return { success: false, error: 'Failed to save session data' };
    }
    
    return { success: true, user: userWithoutPassword };
}

// Login with Google (simplified simulation)
export async function loginWithGoogle() {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
        return { success: false, error: 'Local storage is not available in your browser' };
    }
    
    // This is just a simulation
    const simulatedGoogleUser = {
        id: 'google_' + Date.now().toString(),
        email: 'google_user@example.com',
        name: 'Google User',
        provider: 'google',
        createdAt: new Date().toISOString()
    };
    
    // Auto register if not exists
    const users = getUsers();
    if (!users.find(user => user.email === simulatedGoogleUser.email)) {
        users.push({
            ...simulatedGoogleUser,
            password: 'google_auth' // Placeholder password
        });
        
        const saveResult = saveUsers(users);
        if (!saveResult) {
            return { success: false, error: 'Failed to save user data' };
        }
    }
    
    // Save current user
    try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(simulatedGoogleUser));
    } catch (error) {
        console.error('Error saving current user to localStorage:', error);
        return { success: false, error: 'Failed to save session data' };
    }
    
    return { success: true, user: simulatedGoogleUser };
}

// Logout user
export async function logoutUser() {
    try {
        localStorage.removeItem(CURRENT_USER_KEY);
        return { success: true };
    } catch (error) {
        console.error('Error logging out user:', error);
        return { success: false, error: 'Failed to log out' };
    }
}

// Get current user
export function getCurrentUser() {
    try {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting current user from localStorage:', error);
        return null;
    }
}

// Check if user is logged in
export function isLoggedIn() {
    return !!getCurrentUser();
}

// Add event listener for auth state changes
export function onAuthStateChange(callback) {
    // Initial call
    callback(getCurrentUser());
    
    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', (event) => {
        if (event.key === CURRENT_USER_KEY) {
            const user = event.newValue ? JSON.parse(event.newValue) : null;
            callback(user);
        }
    });
    
    // Return unsubscribe function
    return () => {
        window.removeEventListener('storage', callback);
    };
} 