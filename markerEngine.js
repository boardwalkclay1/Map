// modules/markerEngine.js
import { MapCore } from './mapCore.js'; // only for type clarity / future; not required at runtime

export class MarkerEngine {
  /**
   * @param {MapCore} mapCore
   * @param {HTMLElement} layer
   * @param {StorageEngine} storageEngine
   */
  constructor(mapCore, layer, storageEngine) {
    this.mapCore = mapCore;
    this.layer = layer;
    this.storage = storageEngine;
    this.markers = [];
    this.selectedId = null;

    this._loadFromStorage();
    this._attachToMap();
    this._renderAll();
  }

  _loadFromStorage() {
    this.markers = this.storage.getMarkers();
  }

  _persist() {
    this.storage.setMarkers(this.markers);
  }

  _attachToMap() {
    // coordinate marker updates after map rendering
    const originalRender = this.mapCore.render.bind(this.mapCore);

    this.mapCore.render = () => {
      originalRender();
      this.syncWithCamera();
    };
  }

  addMarker(lat, lng, meta = {}) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const marker = { id, lat, lng, meta };
    this.markers.push(marker);
    this._persist();
    this._renderAll();
    return marker;
  }

  clearAll() {
    this.markers = [];
    this.selectedId = null;
    this._persist();
    this._renderAll();
  }

  selectMarker(id) {
    this.selectedId = id;
    this.layer.querySelectorAll('.marker').forEach(m => {
      m.classList.toggle('selected', m.dataset.id === id);
    });
  }

  syncWithCamera() {
    this._renderAll();
  }

  _renderAll() {
    this.layer.innerHTML = '';

    const rect = this.layer.getBoundingClientRect();
    const width = rect.width || this.layer.parentElement.clientWidth;
    const height = rect.height || this.layer.parentElement.clientHeight;

    const centerPx = this._latLngToPx(this.mapCore.center.lat, this.mapCore.center.lng);

    for (const marker of this.markers) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.dataset.id = marker.id;

      const px = this._latLngToPx(marker.lat, marker.lng);
      const screenX = width / 2 + (px.x - centerPx.x);
      const screenY = height / 2 + (px.y - centerPx.y);

      el.style.left = `${screenX}px`;
      el.style.top = `${screenY}px`;

      if (marker.id === this.selectedId) {
        el.classList.add('selected');
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectMarker(marker.id);
        if (typeof this.onMarkerClick === 'function') {
          this.onMarkerClick(marker);
        }
      });

      this.layer.appendChild(el);
    }
  }

  _latLngToPx(lat, lng) {
    const tileSize = this.mapCore.tileSize;
    const zoom = this.mapCore.zoom;

    const scale = tileSize * Math.pow(2, zoom);
    const worldX = (lng + 180) / 360;
    const sinLat = Math.sin(lat * Math.PI / 180);
    const worldY = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
    return {
      x: worldX * scale,
      y: worldY * scale
    };
  }
}
