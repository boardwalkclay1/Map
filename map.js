// map.js
const TILE_SIZE = 256;
const MIN_ZOOM = 2;
const MAX_ZOOM = 19;

// Free OSM tile endpoint
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_SUBDOMAINS = ['a', 'b', 'c'];

class CustomMap {
  constructor(options) {
    this.container = options.container;
    this.tilesLayer = options.tilesLayer;
    this.center = options.center || { lat: 0, lng: 0 }; // lat, lng
    this.zoom = options.zoom || 3;

    this.dragging = false;
    this.lastDragPos = null;

    this._initEvents();
    this.render();
  }

  // --- Coordinate helpers ---

  latLngToPoint(lat, lng, zoom) {
    const sinLat = Math.sin(lat * Math.PI / 180);
    const zoomFactor = 2 ** zoom;

    const x = ((lng + 180) / 360) * TILE_SIZE * zoomFactor;
    const y = (
      (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI))
      * TILE_SIZE * zoomFactor
    );

    return { x, y };
  }

  pointToLatLng(x, y, zoom) {
    const zoomFactor = 2 ** zoom;
    const lng = (x / (TILE_SIZE * zoomFactor)) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / (TILE_SIZE * zoomFactor);
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return { lat, lng };
  }

  // --- Core render ---

  render() {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const centerPoint = this.latLngToPoint(this.center.lat, this.center.lng, this.zoom);

    // Top-left corner of the viewport in "world" pixels
    const topLeft = {
      x: centerPoint.x - width / 2,
      y: centerPoint.y - height / 2
    };

    // Determine visible tile range
    const zoomFactor = 2 ** this.zoom;
    const worldSize = TILE_SIZE * zoomFactor;

    const xStart = Math.floor(topLeft.x / TILE_SIZE);
    const yStart = Math.floor(topLeft.y / TILE_SIZE);
    const xEnd = Math.floor((topLeft.x + width) / TILE_SIZE);
    const yEnd = Math.floor((topLeft.y + height) / TILE_SIZE);

    // Clear existing tiles
    this.tilesLayer.innerHTML = '';

    for (let ty = yStart; ty <= yEnd; ty++) {
      for (let tx = xStart; tx <= xEnd; tx++) {
        const wrappedX = ((tx % zoomFactor) + zoomFactor) % zoomFactor;
        const wrappedY = ((ty % zoomFactor) + zoomFactor) % zoomFactor;

        const tileLeft = tx * TILE_SIZE - topLeft.x;
        const tileTop = ty * TILE_SIZE - topLeft.y;

        const img = document.createElement('img');
        const subdomain = TILE_SUBDOMAINS[(wrappedX + wrappedY) % TILE_SUBDOMAINS.length];

        img.src = TILE_URL
          .replace('{s}', subdomain)
          .replace('{z}', this.zoom)
          .replace('{x}', wrappedX)
          .replace('{y}', wrappedY);

        img.style.position = 'absolute';
        img.style.left = `${tileLeft}px`;
        img.style.top = `${tileTop}px`;
        img.style.width = `${TILE_SIZE}px`;
        img.style.height = `${TILE_SIZE}px`;

        this.tilesLayer.appendChild(img);
      }
    }
  }

  // --- Interaction ---

  setZoom(newZoom, anchorScreenPoint = null) {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    if (clamped === this.zoom) return;

    const rect = this.container.getBoundingClientRect();
    const centerPoint = this.latLngToPoint(this.center.lat, this.center.lng, this.zoom);

    let anchorWorldBefore = centerPoint;
    if (anchorScreenPoint) {
      const dx = anchorScreenPoint.x - rect.width / 2;
      const dy = anchorScreenPoint.y - rect.height / 2;
      anchorWorldBefore = {
        x: centerPoint.x + dx,
        y: centerPoint.y + dy
      };
    }

    const anchorLatLng = this.pointToLatLng(anchorWorldBefore.x, anchorWorldBefore.y, this.zoom);
    const anchorWorldAfter = this.latLngToPoint(anchorLatLng.lat, anchorLatLng.lng, clamped);

    let newCenterWorld = anchorWorldAfter;
    if (anchorScreenPoint) {
      const dx = anchorScreenPoint.x - rect.width / 2;
      const dy = anchorScreenPoint.y - rect.height / 2;
      newCenterWorld = {
        x: anchorWorldAfter.x - dx,
        y: anchorWorldAfter.y - dy
      };
    }

    const newCenterLatLng = this.pointToLatLng(newCenterWorld.x, newCenterWorld.y, clamped);

    this.zoom = clamped;
    this.center = newCenterLatLng;
    this.render();
  }

  panBy(deltaX, deltaY) {
    const rect = this.container.getBoundingClientRect();
    const centerPoint = this.latLngToPoint(this.center.lat, this.center.lng, this.zoom);
    const newCenterPoint = {
      x: centerPoint.x - deltaX,
      y: centerPoint.y - deltaY
    };
    this.center = this.pointToLatLng(newCenterPoint.x, newCenterPoint.y, this.zoom);
    this.render();
  }

  _initEvents() {
    const onMouseDown = (e) => {
      this.dragging = true;
      this.lastDragPos = { x: e.clientX, y: e.clientY };
      this.container.classList.add('dragging');
    };

    const onMouseMove = (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastDragPos.x;
      const dy = e.clientY - this.lastDragPos.y;
      this.lastDragPos = { x: e.clientX, y: e.clientY };
      this.panBy(dx, dy);
    };

    const onMouseUp = () => {
      this.dragging = false;
      this.container.classList.remove('dragging');
    };

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      const rect = this.container.getBoundingClientRect();
      const anchor = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this.setZoom(this.zoom + delta, anchor);
    };

    this.container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    this.container.addEventListener('wheel', onWheel, { passive: false });

    // Touch support
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.dragging = true;
        this.lastDragPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    });

    this.container.addEventListener('touchmove', (e) => {
      if (!this.dragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - this.lastDragPos.x;
      const dy = touch.clientY - this.lastDragPos.y;
      this.lastDragPos = { x: touch.clientX, y: touch.clientY };
      this.panBy(dx, dy);
    });

    this.container.addEventListener('touchend', () => {
      this.dragging = false;
    });
  }
}

// --- Bootstrapping ---

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('map-container');
  const tilesLayer = document.getElementById('map-tiles');

  const map = new CustomMap({
    container,
    tilesLayer,
    center: { lat: 33.7490, lng: -84.3880 }, // Atlanta
    zoom: 11
  });

  document.getElementById('zoom-in').addEventListener('click', () => {
    map.setZoom(map.zoom + 1);
  });

  document.getElementById('zoom-out').addEventListener('click', () => {
    map.setZoom(map.zoom - 1);
  });

  // Expose globally if you want to hook into it later
  window.customMap = map;
});
