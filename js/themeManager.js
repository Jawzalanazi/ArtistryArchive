// THEME MANAGER - Handles dark/light theme toggle
class ThemeManager {
    constructor() {
        this._theme = localStorage.getItem('theme') || 'dark';
        this._init();
    }

    _init() {
        this._applyTheme(this._theme);
        this._bindToggle();
    }

    _applyTheme(theme) {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(`${theme}-theme`);
        this._updateToggleIcon();
        localStorage.setItem('theme', theme);
        this._theme = theme;
    }

    toggle() {
        const newTheme = this._theme === 'dark' ? 'light' : 'dark';
        this._applyTheme(newTheme);
    }

    _updateToggleIcon() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = this._theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
            }
        }
    }

    _bindToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
}
