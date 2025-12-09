/**
 * The Artistry Archive - Pure Vanilla JavaScript Application
 * 
 * Architecture: Object-Oriented ES6 Classes
 * Pattern: Event-driven communication between components
 * Storage: In-memory (volatile - data clears on page refresh)
 * 
 * This frontend is designed for future backend integration.
 * Comments marked with "TODO: BACKEND" indicate where API calls should be added.
 */

// ============================================================================
// EVENT BUS - Custom event system for class-to-class communication
// ============================================================================

class EventBus {
    constructor() {
        this._events = {};
    }

    on(eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    }

    off(eventName, callback) {
        if (!this._events[eventName]) return;
        this._events[eventName] = this._events[eventName].filter(cb => cb !== callback);
    }

    emit(eventName, data) {
        if (!this._events[eventName]) return;
        this._events[eventName].forEach(callback => callback(data));
    }
}

// ============================================================================
// PAINTING MODEL - Represents a single painting entity
// ============================================================================

class Painting {
    constructor({ id = null, title, artist, year, style, description = '', image = '', createdAt = null }) {
        this._id = id;
        this._title = title;
        this._artist = artist;
        this._year = parseInt(year);
        this._style = style;
        this._description = description;
        this._image = image || 'https://via.placeholder.com/400x300?text=No+Image';
        this._createdAt = createdAt || new Date().toISOString();
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get title() { return this._title; }
    set title(value) { this._title = value; }

    get artist() { return this._artist; }
    set artist(value) { this._artist = value; }

    get year() { return this._year; }
    set year(value) { this._year = parseInt(value); }

    get style() { return this._style; }
    set style(value) { this._style = value; }

    get description() { return this._description; }
    set description(value) { this._description = value; }

    get image() { return this._image; }
    set image(value) { this._image = value || 'https://via.placeholder.com/400x300?text=No+Image'; }

    get createdAt() { return this._createdAt; }

    toJSON() {
        return {
            id: this._id,
            title: this._title,
            artist: this._artist,
            year: this._year,
            style: this._style,
            description: this._description,
            image: this._image,
            createdAt: this._createdAt
        };
    }

    static fromJSON(data) {
        return new Painting(data);
    }

    update(data) {
        if (data.title !== undefined) this._title = data.title;
        if (data.artist !== undefined) this._artist = data.artist;
        if (data.year !== undefined) this._year = parseInt(data.year);
        if (data.style !== undefined) this._style = data.style;
        if (data.description !== undefined) this._description = data.description;
        if (data.image !== undefined) this._image = data.image || this._image;
    }
}

// ============================================================================
// API SERVICE - Simulates backend API with Promises/async
// Designed for easy replacement with real fetch() calls
// ============================================================================

class ApiService {
    constructor() {
        this._storageKey = 'artistry_archive_paintings';
        this._paintings = [];
        this._styles = [
            'Renaissance', 'Baroque', 'Rococo', 'Neoclassicism', 'Romanticism',
            'Impressionism', 'Post-Impressionism', 'Expressionism', 'Cubism',
            'Surrealism', 'Abstract', 'Modern', 'Contemporary'
        ];
        this._loadFromStorage();
    }

    _getMockData() {
        return [
            {
                id: 'mock_1',
                title: 'Starry Night',
                artist: 'Vincent van Gogh',
                year: 1889,
                style: 'Post-Impressionism',
                description: 'A swirling night sky over a village, with a prominent cypress tree in the foreground. One of the most recognized paintings in Western art.',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mock_2',
                title: 'The Persistence of Memory',
                artist: 'Salvador Dalí',
                year: 1931,
                style: 'Surrealism',
                description: 'Famous surrealist work featuring melting clocks in a dreamlike landscape, exploring the nature of time and memory.',
                image: 'https://uploads6.wikiart.org/images/salvador-dali/the-persistence-of-memory-1931.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mock_3',
                title: 'Girl with a Pearl Earring',
                artist: 'Johannes Vermeer',
                year: 1665,
                style: 'Baroque',
                description: 'Often referred to as the "Mona Lisa of the North", this tronie depicts a girl wearing an exotic dress and a large pearl earring.',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mock_4',
                title: 'The Birth of Venus',
                artist: 'Sandro Botticelli',
                year: 1485,
                style: 'Renaissance',
                description: 'Depicts the goddess Venus emerging from the sea as a fully grown woman, a masterpiece of the Italian Renaissance.',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mock_5',
                title: 'Water Lilies',
                artist: 'Claude Monet',
                year: 1906,
                style: 'Impressionism',
                description: 'Part of a series of approximately 250 oil paintings depicting Monet\'s flower garden at his home in Giverny.',
                image: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mock_6',
                title: 'The Great Wave off Kanagawa',
                artist: 'Katsushika Hokusai',
                year: 1831,
                style: 'Modern',
                description: 'A woodblock print depicting an enormous wave threatening boats off the coast of Kanagawa, with Mount Fuji in the background.',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg',
                createdAt: new Date().toISOString()
            }
        ];
    }

    _loadFromStorage() {
        try {
            const stored = localStorage.getItem(this._storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this._paintings = data.map(p => Painting.fromJSON(p));
            } else {
                const mockData = this._getMockData();
                this._paintings = mockData.map(p => Painting.fromJSON(p));
                this._saveToStorage();
            }
        } catch (e) {
            console.error('Error loading paintings from storage:', e);
            this._paintings = [];
        }
    }

    _saveToStorage() {
        try {
            const data = this._paintings.map(p => p.toJSON());
            localStorage.setItem(this._storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving paintings to storage:', e);
        }
    }

    _generateId() {
        return 'painting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    _simulateDelay(ms = 50) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAllPaintings() {
        await this._simulateDelay();
        return this._paintings.map(p => p.toJSON());
    }

    async getPaintingById(id) {
        await this._simulateDelay();
        const painting = this._paintings.find(p => p.id === id);
        return painting ? painting.toJSON() : null;
    }

    async createPainting(paintingData) {
        await this._simulateDelay();
        const painting = new Painting({
            ...paintingData,
            id: this._generateId()
        });
        this._paintings.push(painting);
        this._saveToStorage();
        return painting.toJSON();
    }

    async updatePainting(id, updatedData) {
        await this._simulateDelay();
        const painting = this._paintings.find(p => p.id === id);
        if (!painting) {
            throw new Error('Painting not found');
        }
        painting.update(updatedData);
        this._saveToStorage();
        return painting.toJSON();
    }

    async deletePainting(id) {
        await this._simulateDelay();
        const index = this._paintings.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Painting not found');
        }
        this._paintings.splice(index, 1);
        this._saveToStorage();
        return { success: true, id };
    }

    async getStyles() {
        await this._simulateDelay();
        return [...this._styles];
    }

    async filterByStyle(style) {
        await this._simulateDelay();
        if (!style || style === 'all') {
            return this._paintings.map(p => p.toJSON());
        }
        return this._paintings.filter(p => p.style === style).map(p => p.toJSON());
    }

    async clearAll() {
        await this._simulateDelay();
        this._paintings = [];
        this._saveToStorage();
        return { success: true };
    }
}

// ============================================================================
// THEME MANAGER - Handles dark/light theme toggle
// ============================================================================

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

// ============================================================================
// AUTH MANAGER - Manages authentication state via sessionStorage
// ============================================================================

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

// ============================================================================
// TOAST SERVICE - Handles toast notifications
// ============================================================================

class ToastService {
    show(title, message, type = 'success') {
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
                <div class="toast-body">${message}</div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    }
}

// ============================================================================
// GALLERY UI - Renders paintings in the public gallery/collection
// ============================================================================

class GalleryUI {
    constructor(apiService, eventBus) {
        this._apiService = apiService;
        this._eventBus = eventBus;
        this._currentFilter = 'all';
        this._bindEvents();
    }

    _bindEvents() {
        this._eventBus.on('painting:added', () => this.render());
        this._eventBus.on('painting:updated', () => this.render());
        this._eventBus.on('painting:deleted', () => this.render());
    }

    async populateStyleFilter() {
        const select = document.getElementById('styleFilter');
        if (!select) return;

        const styles = await this._apiService.getStyles();
        styles.forEach(style => {
            const option = document.createElement('option');
            option.value = style;
            option.textContent = style;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this._currentFilter = e.target.value;
            this.render();
        });
    }

    async render() {
        const gallery = document.getElementById('galleryGrid');
        const emptyState = document.getElementById('emptyState');

        if (!gallery) return;

        const paintings = await this._apiService.filterByStyle(this._currentFilter);

        if (paintings.length === 0) {
            gallery.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        gallery.innerHTML = paintings.map(painting => this._renderCard(painting)).join('');
    }

    _renderCard(painting) {
        return `
            <article class="painting-card" onclick="window.location.href='painting.html?id=${painting.id}'">
                <figure class="painting-card-figure">
                    <img src="${painting.image}" alt="${painting.title}" class="painting-card-img" 
                         onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                </figure>
                <div class="painting-card-body">
                    <h3 class="painting-card-title">${painting.title}</h3>
                    <div class="painting-card-meta">
                        <p class="painting-card-artist">${painting.artist}</p>
                        <span class="painting-card-year">${painting.year}</span>
                    </div>
                </div>
            </article>
        `;
    }
}

// ============================================================================
// DASHBOARD UI - Renders paintings table in admin dashboard
// ============================================================================

class DashboardUI {
    constructor(apiService, eventBus, toastService) {
        this._apiService = apiService;
        this._eventBus = eventBus;
        this._toastService = toastService;
        this._currentEditId = null;
        this._bindEvents();
    }

    _bindEvents() {
        this._eventBus.on('painting:added', () => this.render());
        this._eventBus.on('painting:updated', () => this.render());
        this._eventBus.on('painting:deleted', () => this.render());
    }

    async init() {
        await this._populateStyleSelects();
        await this.render();
        this._bindForms();
    }

    async _populateStyleSelects() {
        const styles = await this._apiService.getStyles();
        
        ['addStyle', 'editStyle'].forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            select.innerHTML = '<option value="">Select Style</option>';
            styles.forEach(style => {
                const option = document.createElement('option');
                option.value = style;
                option.textContent = style;
                select.appendChild(option);
            });
        });
    }

    async render() {
        const tableBody = document.getElementById('paintingsTableBody');
        const emptyState = document.getElementById('emptyTableMessage');
        const tableContainer = document.querySelector('.table-container');

        if (!tableBody) return;

        const paintings = await this._apiService.getAllPaintings();

        if (paintings.length === 0) {
            tableBody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (tableContainer) tableContainer.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'block';

        tableBody.innerHTML = paintings.map(painting => this._renderRow(painting)).join('');
    }

    _renderRow(painting) {
        return `
            <tr>
                <td>
                    <figure class="table-thumbnail-figure">
                        <img src="${painting.image}" alt="${painting.title}" class="table-thumbnail" 
                             onerror="this.src='https://via.placeholder.com/60x40?text=No+Image'">
                    </figure>
                </td>
                <td>
                    <strong>${painting.title}</strong><br>
                    <small class="text-muted">${painting.artist}</small>
                </td>
                <td>${painting.style}</td>
                <td>${painting.year}</td>
                <td>
                    <button class="btn btn-sm btn-outline-gold me-1" onclick="app.editPainting('${painting.id}')" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.confirmDelete('${painting.id}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    _bindForms() {
        this._bindAddForm();
        this._bindEditForm();
        this._bindDeleteConfirm();
    }

    _bindAddForm() {
        const addForm = document.getElementById('addPaintingForm');
        if (addForm) {
            addForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this._handleAdd();
            });
        }
    }

    async _handleAdd() {
        const title = document.getElementById('addTitle').value;
        const artist = document.getElementById('addArtist').value;
        const year = document.getElementById('addYear').value;
        const style = document.getElementById('addStyle').value;
        const description = document.getElementById('addDescription').value;

        const imageUrlInput = document.getElementById('addImageUrl');
        const imageFileInput = document.getElementById('addImageFile');
        let imageUrl = '';

        if (imageUrlInput?.value?.trim()) {
            imageUrl = imageUrlInput.value.trim();
        } else if (imageFileInput?.files?.[0]) {
            imageUrl = URL.createObjectURL(imageFileInput.files[0]);
        }

        const paintingData = {
            title,
            artist,
            year: parseInt(year),
            style,
            description,
            image: imageUrl
        };

        try {
            const newPainting = await this._apiService.createPainting(paintingData);
            this._eventBus.emit('painting:added', newPainting);

            const form = document.getElementById('addPaintingForm');
            if (form) form.reset();

            const modal = bootstrap.Modal.getInstance(document.getElementById('addPaintingModal'));
            if (modal) modal.hide();

            this._toastService.show('Success', 'Painting added to the archive!');
        } catch (error) {
            this._toastService.show('Error', error.message, 'error');
        }
    }

    _bindEditForm() {
        const editForm = document.getElementById('editPaintingForm');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this._handleEdit();
            });
        }
    }

    async showEditModal(id) {
        this._currentEditId = id;
        const painting = await this._apiService.getPaintingById(id);

        if (painting) {
            document.getElementById('editPaintingId').value = painting.id;
            document.getElementById('editTitle').value = painting.title;
            document.getElementById('editArtist').value = painting.artist;
            document.getElementById('editYear').value = painting.year;
            document.getElementById('editStyle').value = painting.style;
            document.getElementById('editDescription').value = painting.description || '';

            const editImageUrl = document.getElementById('editImageUrl');
            if (editImageUrl) editImageUrl.value = '';
            const editImageFile = document.getElementById('editImageFile');
            if (editImageFile) editImageFile.value = '';

            const modal = new bootstrap.Modal(document.getElementById('editPaintingModal'));
            modal.show();
        }
    }

    async _handleEdit() {
        const id = document.getElementById('editPaintingId').value;
        const title = document.getElementById('editTitle').value;
        const artist = document.getElementById('editArtist').value;
        const year = document.getElementById('editYear').value;
        const style = document.getElementById('editStyle').value;
        const description = document.getElementById('editDescription').value;

        const currentPainting = await this._apiService.getPaintingById(id);
        let imageUrl = currentPainting?.image || '';

        const imageUrlInput = document.getElementById('editImageUrl');
        const imageFileInput = document.getElementById('editImageFile');
        
        if (imageUrlInput?.value?.trim()) {
            imageUrl = imageUrlInput.value.trim();
        } else if (imageFileInput?.files?.[0]) {
            imageUrl = URL.createObjectURL(imageFileInput.files[0]);
        }

        const updatedData = {
            title,
            artist,
            year: parseInt(year),
            style,
            description,
            image: imageUrl
        };

        try {
            const updatedPainting = await this._apiService.updatePainting(id, updatedData);
            this._eventBus.emit('painting:updated', updatedPainting);

            const modal = bootstrap.Modal.getInstance(document.getElementById('editPaintingModal'));
            if (modal) modal.hide();

            this._toastService.show('Success', 'Painting updated successfully!');
        } catch (error) {
            this._toastService.show('Error', error.message, 'error');
        }
    }

    _bindDeleteConfirm() {
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                await this._handleDelete();
            });
        }
    }

    showDeleteModal(id) {
        this._currentEditId = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }

    async _handleDelete() {
        if (!this._currentEditId) return;

        try {
            await this._apiService.deletePainting(this._currentEditId);
            this._eventBus.emit('painting:deleted', { id: this._currentEditId });

            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            if (modal) modal.hide();

            this._toastService.show('Success', 'Painting removed from the archive.');
            this._currentEditId = null;
        } catch (error) {
            this._toastService.show('Error', error.message, 'error');
        }
    }
}

// ============================================================================
// PAINTING DETAIL UI - Renders single painting view
// ============================================================================

class PaintingDetailUI {
    constructor(apiService) {
        this._apiService = apiService;
    }

    async render(paintingId) {
        const container = document.getElementById('paintingDetail');
        if (!container) return;

        if (!paintingId) {
            this._renderNotFound(container);
            return;
        }

        const painting = await this._apiService.getPaintingById(paintingId);

        if (!painting) {
            this._renderNotFound(container);
            return;
        }

        container.innerHTML = `
            <a href="index.html#collection" class="back-to-collection">
                <i class="bi bi-arrow-left"></i>
                <span>Back to Collection</span>
            </a>
            <article class="painting-detail-article">
                <div class="row">
                    <div class="col-lg-6">
                        <figure class="painting-detail-figure">
                            <img src="${painting.image}" alt="${painting.title}" class="painting-detail-img" 
                                 onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Found'">
                        </figure>
                    </div>
                    <div class="col-lg-6">
                        <section class="painting-detail-content">
                            <h1 class="painting-detail-title">${painting.title}</h1>
                            <p class="painting-detail-artist">by ${painting.artist}</p>
                            <div class="painting-detail-meta">
                                <span class="detail-badge">${painting.year}</span>
                                <span class="detail-badge">${painting.style}</span>
                            </div>
                            <p class="painting-detail-description">${painting.description || 'No description available.'}</p>
                            <time class="painting-detail-date" datetime="${painting.createdAt}">
                                Added: ${new Date(painting.createdAt).toLocaleDateString()}
                            </time>
                        </section>
                    </div>
                </div>
            </article>
        `;
    }

    _renderNotFound(container) {
        container.innerHTML = `
            <div class="text-center">
                <p class="text-muted">Painting not found.</p>
                <a href="index.html" class="btn btn-gold">Back to Gallery</a>
            </div>
        `;
    }
}

// ============================================================================
// LOGIN UI - Handles login form
// ============================================================================

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

// ============================================================================
// NAVIGATION UI - Updates navigation based on auth state
// ============================================================================

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

// ============================================================================
// MAIN APPLICATION - Coordinates all classes
// ============================================================================

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

// ============================================================================
// APPLICATION INITIALIZATION
// Only one global constant for the main app instance
// ============================================================================

const app = new App();
app.init();
