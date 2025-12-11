// PAINTING MODEL - Represents a single painting entity
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
