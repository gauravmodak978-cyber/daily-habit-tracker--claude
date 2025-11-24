// Authentication Module

const auth = {
    currentUser: null,

    switchTab(tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
        document.querySelectorAll('.msg').forEach(e => e.classList.remove('show'));
    },

    togglePass(id) {
        const el = document.getElementById(id);
        el.type = el.type === 'password' ? 'text' : 'password';
    },

    showError(id, msg) {
        const el = document.getElementById(id);
        el.textContent = msg;
        el.classList.add('show');
    },

    updateUserCount() {
        const count = storage.getUserCount();
        document.getElementById('userCount').textContent = count;
        const btn = document.getElementById('signupBtn');
        if(btn) {
            btn.disabled = count >= storage.MAX_USERS;
            btn.textContent = count >= storage.MAX_USERS ? 'Limit Reached' : 'Create Account';
        }
    },

    handleSignup(e) {
        e.preventDefault();
        const username = document.getElementById('signupUser').value.trim().toLowerCase();
        const password = document.getElementById('signupPass').value;
        const confirm = document.getElementById('signupConfirm').value;

        document.querySelectorAll('.msg').forEach(e => e.classList.remove('show'));

        if(username.length < 3) return this.showError('signupError', 'Username too short');
        if(!/^[a-z0-9_]+$/.test(username)) return this.showError('signupError', 'Invalid username');
        if(password.length < 4) return this.showError('signupError', 'Password too short');
        if(password !== confirm) return this.showError('signupError', 'Passwords don\'t match');

        if(storage.getUserCount() >= storage.MAX_USERS) {
            return this.showError('signupError', 'User limit reached');
        }
        if(storage.userExists(username)) {
            return this.showError('signupError', 'Username exists');
        }

        storage.saveUserData(username, {
            passwordHash: utils.hash(password),
            habits: [],
            completions: {}
        });
        
        this.updateUserCount();

        const success = document.getElementById('signupSuccess');
        success.textContent = 'Account created! Please login.';
        success.classList.add('show');

        setTimeout(() => {
            this.switchTab('login');
            document.getElementById('loginUser').value = username;
        }, 1500);
    },

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUser').value.trim().toLowerCase();
        const password = document.getElementById('loginPass').value;

        document.getElementById('loginError').classList.remove('show');

        if(!storage.userExists(username)) {
            return this.showError('loginError', 'User not found');
        }

        const userData = storage.getUserData(username);
        if(userData.passwordHash !== utils.hash(password)) {
            return this.showError('loginError', 'Wrong password');
        }

        this.currentUser = username;
        storage.setCurrentUser(username);
        this.showApp();
    },

    logout() {
        this.currentUser = null;
        storage.clearCurrentUser();
        document.getElementById('auth').classList.remove('hidden');
        document.getElementById('app').classList.remove('active');
    },

    showApp() {
        document.getElementById('auth').classList.add('hidden');
        document.getElementById('app').classList.add('active');
        document.getElementById('username').textContent = this.currentUser;
        document.getElementById('avatar').textContent = this.currentUser.charAt(0).toUpperCase();
        habits.loadData();
        habits.renderAll();
    },

    checkSession() {
        const username = storage.getCurrentUser();
        if(username && storage.userExists(username)) {
            this.currentUser = username;
            this.showApp();
        } else {
            this.updateUserCount();
        }
    }
};
