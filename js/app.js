class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.bindToggle();
    }

    applyTheme(theme) {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(`${theme}-theme`);
        this.updateToggleIcon();
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    toggle() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    updateToggleIcon() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = this.theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
            }
        }
    }

    bindToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
}

class AuthManager {
    constructor() {
        this._storageKey = 'artistry_session';
        this._onLoginChange = null;
    }

    get isLoggedIn() {
        return sessionStorage.getItem(this._storageKey) === 'true';
    }

    login() {
        sessionStorage.setItem(this._storageKey, 'true');
        if (this._onLoginChange) {
            this._onLoginChange(true);
        }
    }

    logout() {
        sessionStorage.removeItem(this._storageKey);
        if (this._onLoginChange) {
            this._onLoginChange(false);
        }
    }

    onLoginChange(callback) {
        this._onLoginChange = callback;
    }
}

class PaintingService {
    constructor() {
        this._paintings = [];
    }

    getAll() {
        return [...this._paintings];
    }

    getById(id) {
        return this._paintings.find(p => p.id === id) || null;
    }

    add(painting) {
        painting.id = this.generateId();
        this._paintings.push(painting);
        return painting;
    }

    update(id, updatedData) {
        const index = this._paintings.findIndex(p => p.id === id);
        if (index !== -1) {
            this._paintings[index] = { ...this._paintings[index], ...updatedData, id };
            return this._paintings[index];
        }
        return null;
    }

    delete(id) {
        const index = this._paintings.findIndex(p => p.id === id);
        if (index !== -1) {
            this._paintings.splice(index, 1);
            return true;
        }
        return false;
    }

    clear() {
        this._paintings = [];
    }

    getStyles() {
        return [
            'Renaissance',
            'Baroque',
            'Rococo',
            'Neoclassicism',
            'Romanticism',
            'Impressionism',
            'Post-Impressionism',
            'Expressionism',
            'Cubism',
            'Surrealism',
            'Abstract',
            'Modern',
            'Contemporary'
        ];
    }

    filterByStyle(style) {
        if (!style || style === 'all') {
            return this.getAll();
        }
        return this._paintings.filter(p => p.style === style);
    }

    generateId() {
        return 'painting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

class LoginManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.form = null;
    }

    init() {
        this.form = document.getElementById('loginForm');
        if (this.form) {
            this.bindSubmit();
        }
    }

    bindSubmit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        this.authManager.login();
        window.location.href = 'dashboard.html';
    }
}

class GalleryRenderer {
    constructor(paintingService) {
        this.paintingService = paintingService;
    }

    render(style = 'all') {
        const gallery = document.getElementById('galleryGrid');
        const emptyState = document.getElementById('emptyState');

        if (!gallery) return;

        const paintings = this.paintingService.filterByStyle(style);

        if (paintings.length === 0) {
            gallery.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        gallery.innerHTML = paintings.map(painting => `
            <article class="painting-card" onclick="window.location.href='painting.html?id=${painting.id}'">
                <img src="${painting.image}" alt="${painting.title}" class="painting-card-img" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                <div class="painting-card-body">
                    <h3 class="painting-card-title">${painting.title}</h3>
                    <div class="painting-card-meta">
                        <p class="painting-card-artist">${painting.artist}</p>
                        <span class="painting-card-year">${painting.year}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }
}

class UI {
    constructor(paintingService, authManager) {
        this.paintingService = paintingService;
        this.authManager = authManager;
    }

    updateNavigation() {
        const dashboardLinks = document.querySelectorAll('.nav-link-dashboard');
        const loginLinks = document.querySelectorAll('.nav-link-login');
        const logoutLinks = document.querySelectorAll('.nav-link-logout');

        const isLoggedIn = this.authManager.isLoggedIn;

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

    populateStyleFilter() {
        const select = document.getElementById('styleFilter');
        if (!select) return;

        const styles = this.paintingService.getStyles();
        styles.forEach(style => {
            const option = document.createElement('option');
            option.value = style;
            option.textContent = style;
            select.appendChild(option);
        });
    }

    populateStyleSelect(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Select a style...</option>';

        const styles = this.paintingService.getStyles();
        styles.forEach(style => {
            const option = document.createElement('option');
            option.value = style;
            option.textContent = style;
            select.appendChild(option);
        });
    }

    renderPaintingDetail(painting) {
        const container = document.getElementById('paintingDetail');
        if (!container) return;

        if (!painting) {
            container.innerHTML = `
                <div class="text-center">
                    <p class="text-muted">Painting not found.</p>
                    <a href="index.html" class="btn btn-gold">Back to Gallery</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="row">
                <div class="col-lg-6">
                    <img src="${painting.image}" alt="${painting.title}" class="painting-detail-img" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Found'">
                </div>
                <div class="col-lg-6">
                    <div class="painting-detail-content">
                        <h1 class="painting-detail-title">${painting.title}</h1>
                        <p class="painting-detail-artist">by ${painting.artist}</p>
                        <div class="painting-detail-meta">
                            <span class="detail-badge">${painting.year}</span>
                            <span class="detail-badge">${painting.style}</span>
                        </div>
                        <p class="painting-detail-description">${painting.description || 'No description available.'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderDashboardTable(paintings) {
        const tableBody = document.getElementById('paintingsTableBody');
        const emptyState = document.getElementById('dashboardEmptyState');

        if (!tableBody) return;

        if (paintings.length === 0) {
            tableBody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        tableBody.innerHTML = paintings.map(painting => `
            <tr>
                <td>
                    <img src="${painting.image}" alt="${painting.title}" class="table-thumbnail" onerror="this.src='https://via.placeholder.com/60x40?text=No+Image'">
                </td>
                <td>${painting.title}</td>
                <td>${painting.artist}</td>
                <td>${painting.year}</td>
                <td>${painting.style}</td>
                <td>
                    <button class="btn btn-sm btn-outline-gold me-1" onclick="app.editPainting('${painting.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.confirmDelete('${painting.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showToast(title, message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastId = 'toast_' + Date.now();
        const iconClass = type === 'success' ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';

        const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <i class="bi ${iconClass} me-2"></i>
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    fillEditForm(painting) {
        document.getElementById('editPaintingId').value = painting.id;
        document.getElementById('editTitle').value = painting.title;
        document.getElementById('editArtist').value = painting.artist;
        document.getElementById('editYear').value = painting.year;
        document.getElementById('editStyle').value = painting.style;
        document.getElementById('editDescription').value = painting.description || '';
        const editImageFile = document.getElementById('editImageFile');
        if (editImageFile) editImageFile.value = '';
    }

    clearAddForm() {
        const form = document.getElementById('addPaintingForm');
        if (form) form.reset();
    }
}

class App {
    constructor() {
        this.authManager = new AuthManager();
        this.paintingService = new PaintingService();
        this.ui = new UI(this.paintingService, this.authManager);
        this.galleryRenderer = new GalleryRenderer(this.paintingService);
        this.loginManager = null;
        this.themeManager = null;
        this.currentEditId = null;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.themeManager = new ThemeManager();
            this.ui.updateNavigation();
            this.detectPage();
        });
    }

    detectPage() {
        const path = window.location.pathname;

        if (path.includes('dashboard.html')) {
            this.initDashboard();
        } else if (path.includes('login.html')) {
            this.initLogin();
        } else if (path.includes('painting.html')) {
            this.initPaintingDetail();
        } else {
            this.initHome();
        }
    }

    initHome() {
        this.ui.populateStyleFilter();
        this.galleryRenderer.render();
        this.bindStyleFilter();
        this.bindExploreButton();
    }

    initPaintingDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const paintingId = urlParams.get('id');

        if (paintingId) {
            const painting = this.paintingService.getById(paintingId);
            this.ui.renderPaintingDetail(painting);
        } else {
            this.ui.renderPaintingDetail(null);
        }
    }

    initLogin() {
        this.loginManager = new LoginManager(this.authManager);
        this.loginManager.init();
    }

    initDashboard() {
        if (!this.authManager.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }

        this.ui.populateStyleSelect('addStyle');
        this.ui.populateStyleSelect('editStyle');
        this.loadDashboardTable();
        this.bindAddForm();
        this.bindEditForm();
        this.bindDeleteConfirm();
    }

    logout() {
        this.authManager.logout();
        this.paintingService.clear();
        window.location.href = 'index.html';
    }

    loadDashboardTable() {
        const paintings = this.paintingService.getAll();
        this.ui.renderDashboardTable(paintings);
    }

    bindStyleFilter() {
        const filterSelect = document.getElementById('styleFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.galleryRenderer.render(e.target.value);
            });
        }
    }

    bindExploreButton() {
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

    bindAddForm() {
        const addForm = document.getElementById('addPaintingForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddPainting();
            });
        }
    }

    handleAddPainting() {
        const title = document.getElementById('addTitle').value;
        const artist = document.getElementById('addArtist').value;
        const year = document.getElementById('addYear').value;
        const style = document.getElementById('addStyle').value;
        const description = document.getElementById('addDescription').value;
        
        const imageFileInput = document.getElementById('addImageFile');
        let imageUrl = '';
        
        if (imageFileInput && imageFileInput.files && imageFileInput.files[0]) {
            const file = imageFileInput.files[0];
            imageUrl = URL.createObjectURL(file);
        }

        const painting = {
            title,
            artist,
            year: parseInt(year),
            style,
            description,
            image: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
        };

        this.paintingService.add(painting);
        this.loadDashboardTable();
        this.ui.clearAddForm();

        const modal = bootstrap.Modal.getInstance(document.getElementById('addPaintingModal'));
        if (modal) modal.hide();

        this.ui.showToast('Success', 'Painting added to the archive!');
    }

    editPainting(id) {
        const painting = this.paintingService.getById(id);
        if (painting) {
            this.currentEditId = id;
            this.ui.fillEditForm(painting);
            const modal = new bootstrap.Modal(document.getElementById('editPaintingModal'));
            modal.show();
        }
    }

    bindEditForm() {
        const editForm = document.getElementById('editPaintingForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditPainting();
            });
        }
    }

    handleEditPainting() {
        const id = document.getElementById('editPaintingId').value;
        const title = document.getElementById('editTitle').value;
        const artist = document.getElementById('editArtist').value;
        const year = document.getElementById('editYear').value;
        const style = document.getElementById('editStyle').value;
        const description = document.getElementById('editDescription').value;
        
        const currentPainting = this.paintingService.getById(id);
        let imageUrl = currentPainting ? currentPainting.image : '';
        
        const imageFileInput = document.getElementById('editImageFile');
        if (imageFileInput && imageFileInput.files && imageFileInput.files[0]) {
            const file = imageFileInput.files[0];
            imageUrl = URL.createObjectURL(file);
        }

        const updatedPainting = {
            title,
            artist,
            year: parseInt(year),
            style,
            description,
            image: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
        };

        this.paintingService.update(id, updatedPainting);
        this.loadDashboardTable();

        const modal = bootstrap.Modal.getInstance(document.getElementById('editPaintingModal'));
        if (modal) modal.hide();

        this.ui.showToast('Success', 'Painting updated successfully!');
    }

    confirmDelete(id) {
        this.currentEditId = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }

    bindDeleteConfirm() {
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.handleDelete();
            });
        }
    }

    handleDelete() {
        if (this.currentEditId) {
            this.paintingService.delete(this.currentEditId);
            this.loadDashboardTable();

            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            if (modal) modal.hide();

            this.ui.showToast('Success', 'Painting removed from the archive.');
            this.currentEditId = null;
        }
    }
}

const app = new App();
app.init();
