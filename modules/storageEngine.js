// modules/storageEngine.js
export class StorageEngine {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  _readRaw() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  _writeRaw(obj) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch {
      // fail silently; map still works without persistence
    }
  }

  getCamera() {
    const raw = this._readRaw();
    return raw.camera || null;
  }

  setCamera(camera) {
    const raw = this._readRaw();
    raw.camera = camera;
    this._writeRaw(raw);
  }

  getMarkers() {
    const raw = this._readRaw();
    return Array.isArray(raw.markers) ? raw.markers : [];
  }

  setMarkers(markers) {
    const raw = this._readRaw();
    raw.markers = markers;
    this._writeRaw(raw);
  }

  clearAll() {
    this._writeRaw({});
  }
}
