// modules/mapCore.js

// Web Mercator helpers
function latLngToPixel(lat, lng, zoom, tileSize) {
  const scale = tileSize * Math.pow(2, zoom);
  const worldX = (lng + 180) / 360;
  const sinLat = Math.sin(lat * Math.PI / 180);
  const worldY = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
  return { x: worldX * scale, y: worldY * scale };
}

function pixelToLatLng(px, py, zoom, tileSize) {
  const scale = tileSize * Math.pow(2, zoom);
  const worldX = px / scale;
  const worldY = py / scale;
  const lng = worldX * 360 - 180;
  const n = Math.PI - 2 * Math.PI * worldY;
  const lat = 180 / Math.PI * (Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
  return { lat, lng };
}

function lngToX(lng, zoom) {
  const n = Math.pow(2, zoom);
  return ((lng + 180) / 360) * n;
}

function latToY(lat, zoom) {
  const rad = lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const mercY = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  return (1 - mercY / Math.PI) / 2 * n;
}

export class MapCore {
  constructor(container, tileLayer, config, storageEngine) {
    this.container = container;
    this.tileLayer = tileLayer;
    this.config = config;
    this.storage = storageEngine;

    this.tileSize = window.devicePixelRatio > 1 ? 512 : 256;
    this.zoom = config.initialZoom;
    this.center = { ...config.initialCenter };

    this.tiles = new Map();
    this.animationFrame = null;

    this.isDragging = false;
    this.dragStart = null;

    this._initFromStorage();
    this._attachEvents();
    this.render();
  }

  // -------- Lifecycle / State --------
  _initFromStorage() {
    const cam = this.storage.getCamera();
    if (cam && cam.center && typeof cam.zoom === 'number') {
      this.center = cam.center;
      this.zoom = cam.zoom;
    }
  }

  _persistCamera() {
    this.storage.setCamera({
      center: this.center,
      zoom: this.zoom
    });
  }

  // -------- Event wiring --------
  _attachEvents() {
    const cont = this.container;

    cont.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      cont.classList.add('dragging');
      this.dragStart = { x: e.clientX, y: e.clientY };
      this._dragStartCenterPx = latLngToPixel(this.center.lat, this.center.lng, this.zoom, this.tileSize);
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this._panFromPixels(dx, dy);
    });

    window.addEventListener('mouseup', () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      cont.classList.remove('dragging');
      this._persistCamera();
    });

    cont.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      this._zoomAroundScreenPoint(delta, e.clientX, e.clientY);
    }, { passive: false });

    window.addEventListener('resize', () => this.render());
  }

  // -------- Public API --------
  getLatLngFromScreen(screenX, screenY) {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerPx = latLngToPixel(this.center.lat, this.center.lng, this.zoom, this.tileSize);
    const px = centerPx.x + (screenX - width / 2);
    const py = centerPx.y + (screenY - height / 2);
    return pixelToLatLng(px, py, this.zoom, this.tileSize);
  }

  setCamera(center, zoom) {
    this.center = { ...center };
    this.zoom = zoom;
    this._persistCamera();
    this.requestRender();
  }

  resetToInitial() {
    this.center = { ...this.config.initialCenter };
    this.zoom = this.config.initialZoom;
    this._persistCamera();
    this.requestRender();
  }

  // -------- Internal: camera ops --------
  _panFromPixels(dx, dy) {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const startPx = this._dragStartCenterPx;
    const newPx = {
      x: startPx.x - dx,
      y: startPx.y - dy
    };

    const centerLatLng = pixelToLatLng(newPx.x, newPx.y, this.zoom, this.tileSize);
    this.center = centerLatLng;
    this.requestRender();
  }

  _zoomAroundScreenPoint(step, clientX, clientY) {
    const minZoom = this.config.minZoom;
    const maxZoom = this.config.maxZoom;

    const fromZoom = this.zoom;
    let toZoom = fromZoom + step * 0.25;
    toZoom = Math.max(minZoom, Math.min(maxZoom, toZoom));
    if (toZoom === fromZoom) return;

    const rect = this.container.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;

    const before = this.getLatLngFromScreen(sx, sy);
    this.zoom = toZoom;
    const after = this.getLatLngFromScreen(sx, sy);

    this.center.lat += (before.lat - after.lat);
    this.center.lng += (before.lng - after.lng);

    this._persistCamera();
    this.requestRender();
  }

  // -------- Render loop --------
  requestRender() {
    if (this.animationFrame) return;
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = null;
      this.render();
    });
  }

  render() {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const zoomInt = Math.round(this.zoom);
    const scale = Math.pow(2, this.zoom - zoomInt);

    const centerTileX = lngToX(this.center.lng, zoomInt);
    const centerTileY = latToY(this.center.lat, zoomInt);

    const viewportTileWidth = width / this.tileSize / scale;
    const viewportTileHeight = height / this.tileSize / scale;

    const halfW = viewportTileWidth / 2;
    const halfH = viewportTileHeight / 2;

    const minX = Math.floor(centerTileX - halfW - this.config.overfetchTiles);
    const maxX = Math.floor(centerTileX + halfW + this.config.overfetchTiles);
    const minY = Math.floor(centerTileY - halfH - this.config.overfetchTiles);
    const maxY = Math.floor(centerTileY + halfH + this.config.overfetchTiles);

    const numTiles = Math.pow(2, zoomInt);
    const tileKeysInUse = new Set();

    this.tileLayer.style.transform =
      `translate(${width / 2}px, ${height / 2}px) scale(${scale})`;

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const wrappedX = ((x % numTiles) + numTiles) % numTiles;
        const wrappedY = ((y % numTiles) + numTiles) % numTiles;

        const key = `${zoomInt}/${wrappedX}/${wrappedY}`;
        tileKeysInUse.add(key);

        let tile = this.tiles.get(key);
        if (!tile) {
          tile = document.createElement('img');
          tile.className = 'tile';
          const url = this.config.tileUrlTemplate
            .replace('{z}', zoomInt)
            .replace('{x}', wrappedX)
            .replace('{y}', wrappedY);
          tile.src = url;
          tile.onload = () => tile.classList.add('loaded');
          this.tileLayer.appendChild(tile);
          this.tiles.set(key, tile);
        }

        const tilePixelX = (x - centerTileX) * this.tileSize;
        const tilePixelY = (y - centerTileY) * this.tileSize;
        tile.style.left = `${tilePixelX}px`;
        tile.style.top = `${tilePixelY}px`;
        tile.style.width = `${this.tileSize}px`;
        tile.style.height = `${this.tileSize}px`;
      }
    }

    this.tiles.forEach((tile, key) => {
      if (!tileKeysInUse.has(key)) {
        tile.remove();
        this.tiles.delete(key);
      }
    });

    // hook for external modules (markers, overlays)
    if (typeof this.onPostRender === 'function') {
      this.onPostRender();
    }
  }
}
