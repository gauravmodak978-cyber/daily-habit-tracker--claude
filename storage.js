// Storage Management

const storage = {
    MAX_USERS: 10,

    // Get all users
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '{}');
    },

    // Save all users
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },

    // Get current user
    getCurrentUser() {
        return localStorage.getItem('currentUser');
    },

    // Set current user
    setCurrentUser(username) {
        localStorage.setItem('currentUser', username);
    },

    // Clear current user
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
    },

    // Get user data
    getUserData(username) {
        const users = this.getUsers();
        return users[username] || null;
    },

    // Save user data
    saveUserData(username, data) {
        const users = this.getUsers();
        users[username] = data;
        this.saveUsers(users);
    },

    // Check if user exists
    userExists(username) {
        return !!this.getUsers()[username];
    },

    // Get user count
    getUserCount() {
        return Object.keys(this.getUsers()).length;
    },

    // Delete user
    deleteUser(username) {
        const users = this.getUsers();
        delete users[username];
        this.saveUsers(users);
    }
};
