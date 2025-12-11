// PAINTING DETAIL UI - Renders single painting view
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
