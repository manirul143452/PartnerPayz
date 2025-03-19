// Simple user authentication system using localStorage
// This is a basic implementation for demonstration purposes

// User storage
const USERS_STORAGE_KEY = 'partnerpayz_users';
const CURRENT_USER_KEY = 'partnerpayz_current_user';

// Initialize users if not exists
function initUsers() {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }
}

// Get all users
function getUsers() {
    initUsers();
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Register a new user
export async function registerUser(email, password, name) {
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
    saveUsers(users);
    
    // Auto login
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
}

// Login user
export async function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        return { success: false, error: 'Invalid email or password' };
    }
    
    // Don't send password to client
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
}

// Login with Google (simplified simulation)
export async function loginWithGoogle() {
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
        saveUsers(users);
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(simulatedGoogleUser));
    return { success: true, user: simulatedGoogleUser };
}

// Logout user
export async function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
}

// Get current user
export function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
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