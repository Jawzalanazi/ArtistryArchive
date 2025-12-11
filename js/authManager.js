// AUTH MANAGER - Manages authentication state via sessionStorage
class AuthManager {
    constructor(eventBus) {
        this._eventBus = eventBus;
        this._storageKey = 'artistry_session';
    }

    get isLoggedIn() {
        return sessionStorage.getItem(this._storageKey) === 'true';
    }

    login() {
        sessionStorage.setItem(this._storageKey, 'true');
        this._eventBus.emit('auth:login');
    }

    logout() {
        sessionStorage.removeItem(this._storageKey);
        this._eventBus.emit('auth:logout');
    }
}
