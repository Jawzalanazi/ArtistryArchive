// EVENT BUS - Custom event system for class-to-class communication
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
