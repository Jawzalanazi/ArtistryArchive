// LOGIN UI - Handles login form
class LoginUI {
    constructor(authManager) {
        this._authManager = authManager;
        this._init();
    }

    _init() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this._handleLogin();
            });
        }
    }

    _handleLogin() {
        this._authManager.login();
        window.location.href = 'dashboard.html';
    }
}
