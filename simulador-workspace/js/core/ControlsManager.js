// ControlsManager.js - Gerenciador de controles auxiliares
class ControlsManager {
    constructor() {
        this.listeners = {};
    }

    addListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    trigger(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    removeAllListeners() {
        this.listeners = {};
    }
}