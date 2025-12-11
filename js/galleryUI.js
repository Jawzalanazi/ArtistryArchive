// GALLERY UI - Renders paintings in the public gallery/collection
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
