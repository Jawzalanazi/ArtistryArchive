// API SERVICE - Simulates backend API with Promises/async
// Designed for easy replacement with real fetch() calls
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
