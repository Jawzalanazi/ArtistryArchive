// NAVIGATION UI - Updates navigation based on auth state
class NavigationUI {
    constructor(authManager, eventBus) {
        this._authManager = authManager;
        this._eventBus = eventBus;
        this._bindEvents();
    }

    _bindEvents() {
        this._eventBus.on('auth:login', () => this.update());
        this._eventBus.on('auth:logout', () => this.update());
    }

    update() {
        const dashboardLinks = document.querySelectorAll('.nav-link-dashboard');
        const loginLinks = document.querySelectorAll('.nav-link-login');
        const logoutLinks = document.querySelectorAll('.nav-link-logout');

        const isLoggedIn = this._authManager.isLoggedIn;

        dashboardLinks.forEach(link => {
            link.style.display = isLoggedIn ? 'block' : 'none';
        });

        loginLinks.forEach(link => {
            link.style.display = isLoggedIn ? 'none' : 'block';
        });

        logoutLinks.forEach(link => {
            link.style.display = isLoggedIn ? 'block' : 'none';
        });
    }
}
