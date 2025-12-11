

class App {
    constructor() {
        this._eventBus = new EventBus();
        this._apiService = new ApiService();
        this._toastService = new ToastService();
        this._authManager = new AuthManager(this._eventBus);
        this._navigationUI = new NavigationUI(this._authManager, this._eventBus);
        this._themeManager = null;
        this._galleryUI = null;
        this._dashboardUI = null;
        this._loginUI = null;
        this._paintingDetailUI = null;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this._themeManager = new ThemeManager();
            this._navigationUI.update();
            this._detectPage();
        });
    }

    _detectPage() {
        const path = window.location.pathname;

        if (path.includes('dashboard.html')) {
            this._initDashboard();
        } else if (path.includes('login.html')) {
            this._initLogin();
        } else if (path.includes('painting.html')) {
            this._initPaintingDetail();
        } else {
            this._initHome();
        }
    }

    async _initHome() {
        this._galleryUI = new GalleryUI(this._apiService, this._eventBus);
        await this._galleryUI.populateStyleFilter();
        await this._galleryUI.render();
        this._bindExploreButton();
    }

    _initLogin() {
        this._loginUI = new LoginUI(this._authManager);
    }

    async _initDashboard() {
        if (!this._authManager.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }

        this._dashboardUI = new DashboardUI(this._apiService, this._eventBus, this._toastService);
        await this._dashboardUI.init();
    }

    async _initPaintingDetail() {
        this._paintingDetailUI = new PaintingDetailUI(this._apiService);
        const urlParams = new URLSearchParams(window.location.search);
        const paintingId = urlParams.get('id');
        await this._paintingDetailUI.render(paintingId);
    }

    _bindExploreButton() {
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const collectionSection = document.getElementById('collectionSection');
                if (collectionSection) {
                    collectionSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    editPainting(id) {
        if (this._dashboardUI) {
            this._dashboardUI.showEditModal(id);
        }
    }

    confirmDelete(id) {
        if (this._dashboardUI) {
            this._dashboardUI.showDeleteModal(id);
        }
    }

    logout() {
        this._authManager.logout();
        this._apiService.clearAll();
        window.location.href = 'index.html';
    }
}

// APPLICATION INITIALIZATION
const app = new App();
app.init();

// مهم عشان تشتغل أزرار onclick="app.editPainting(...)" في الـ HTML
window.app = app;
