// ============================================================================
// DASHBOARD UI - Renders paintings table in admin dashboard
// Image input: URL ONLY (no file uploads)
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

        // ✅ Image from URL only
        const imageUrlInput = document.getElementById('addImageUrl');
        const imageUrl = imageUrlInput?.value?.trim() || '';

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

            // نحفظ الصورة الحالية كـ default لو ما تغيّر الـ URL
            const editImageUrl = document.getElementById('editImageUrl');
            if (editImageUrl) {
                editImageUrl.value = '';
                editImageUrl.placeholder = painting.image || '';
            }

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

        // ✅ نستخدم URL جديد إذا المستخدم كتبه، وإلا نحتفظ بالصورة القديمة
        const imageUrlInput = document.getElementById('editImageUrl');
        const imageUrl = imageUrlInput?.value?.trim() || currentPainting.image;

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
