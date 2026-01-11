// modules/streetViewShell.js

export class StreetViewShell {
  constructor(mapCore, panoRegistry = []) {
    this.mapCore = mapCore;
    this.panoRegistry = panoRegistry;

    this.panel = document.getElementById('streetview-panel');
    this.pegman = document.getElementById('streetview-pegman');
    this.closeBtn = document.getElementById('streetview-close');
    this.toggleBtn = document.getElementById('btn-toggle-streetview');
    this.canvas = document.getElementById('streetview-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.isDraggingPegman = false;
    this.currentPano = null;

    // pano state
    this.panoImage = null;
    this.yaw = 0;   // horizontal angle
    this.pitch = 0; // vertical angle (kept small)
    this.fov = Math.PI / 2; // 90°

    // drag for pano
    this.isPanoDragging = false;
    this.lastPanoPos = null;

    this._attachEvents();
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());
  }

  _attachEvents() {
    this.toggleBtn.addEventListener('click', () => {
      this.panel.classList.toggle('active');
    });

    this.closeBtn.addEventListener('click', () => {
      this.panel.classList.remove('active');
    });

    // Pegman drag → pick map location
    this.pegman.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.isDraggingPegman = true;
      this.pegman.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDraggingPegman) return;
      const mapEl = document.getElementById('map');
      const rect = mapEl.getBoundingClientRect();
      const x = Math.max(rect.left, Math.min(rect.right, e.clientX));
      const y = Math.max(rect.top, Math.min(rect.bottom, e.clientY));
      this.pegman.style.left = `${x - rect.left}px`;
      this.pegman.style.top = `${y - rect.top}px`;
    });

    window.addEventListener('mouseup', (e) => {
      if (!this.isDraggingPegman) return;
      this.isDraggingPegman = false;
      this.pegman.classList.remove('dragging');

      const mapEl = document.getElementById('map');
      const rect = mapEl.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (inside) {
        const latLng = this.mapCore.getLatLngFromScreen(
          e.clientX - rect.left,
          e.clientY - rect.top
        );
        this.openAt(latLng);
      } else {
        this.resetPegman();
      }
    });

    // Canvas drag for yaw/pitch
    this.canvas.addEventListener('mousedown', (e) => {
      this.isPanoDragging = true;
      this.canvas.style.cursor = 'grabbing';
      this.lastPanoPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanoDragging || !this.panoImage) return;
      const dx = e.clientX - this.lastPanoPos.x;
      const dy = e.clientY - this.lastPanoPos.y;
      this.lastPanoPos = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.005;
      this.yaw -= dx * sensitivity;
      this.pitch -= dy * sensitivity;
      const maxPitch = Math.PI / 4;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
      this._renderPano();
    });

    window.addEventListener('mouseup', () => {
      if (!this.isPanoDragging) return;
      this.isPanoDragging = false;
      this.canvas.style.cursor = 'grab';
    });
  }

  resetPegman() {
    this.pegman.style.left = '50%';
    this.pegman.style.top = '50%';
  }

  openAt(latLng) {
    const closest = this._findClosestPano(latLng);
    if (!closest) {
      this.panel.classList.add('active');
      this._renderNoPanoMessage(latLng);
      if (typeof this.onStreetViewOpen === 'function') {
        this.onStreetViewOpen(latLng);
      }
      return;
    }

    this.currentPano = closest;
    this.yaw = 0;
    this.pitch = 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.panoImage = img;
      this.panel.classList.add('active');
      this._renderPano();
      if (typeof this.onStreetViewOpen === 'function') {
        this.onStreetViewOpen(latLng);
      }
    };
    img.onerror = () => {
      this.panoImage = null;
      this.panel.classList.add('active');
      this._renderNoPanoMessage(latLng, true);
    };
    img.src = closest.imageUrl;
  }

  _findClosestPano(latLng) {
    if (!this.panoRegistry || !this.panoRegistry.length) return null;
    let best = null;
    let bestDist = Infinity;
    for (const pano of this.panoRegistry) {
      const d = this._distance(latLng, pano);
      if (d < bestDist) {
        bestDist = d;
        best = pano;
      }
    }
    // simple threshold: 200m
    return bestDist <= 200 ? best : null;
  }

  _resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    if (this.panoImage) {
      this._renderPano();
    }
  }

  _renderNoPanoMessage(latLng, error = false) {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const msg = error
      ? 'Pano failed to load.'
      : 'No panorama found near this location.';
    ctx.fillText(msg, w / 2, h / 2 - 10);
    ctx.fillText(
      `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`,
      w / 2,
      h / 2 + 10
    );
  }

  _renderPano() {
    const ctx = this.ctx;
    const img = this.panoImage;
    if (!ctx || !img) return;

    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const cols = width;
    const rows = height;

    const imgW = img.width;
    const imgH = img.height;

    const centerY = imgH / 2;

    for (let x = 0; x < cols; x++) {
      const ndcX = (x / cols) * 2 - 1;
      const theta = ndcX * this.fov + this.yaw;

      const ratio = height / width;
      for (let y = 0; y < rows; y += 2) {
        const ndcY = (y / rows) * 2 - 1;
        const phi = ndcY * this.fov * ratio + this.pitch;

        const u = (theta / (2 * Math.PI) + 1) % 1;
        const v = 0.5 - phi / Math.PI;

        const srcX = Math.floor(u * imgW);
        const srcY = Math.floor(v * imgH);
        if (srcY < 0 || srcY >= imgH) continue;

        ctx.drawImage(
          img,
          srcX, srcY, 1, 1,
          x, y, 1, 2
        );
      }
    }
  }

  _distance(a, b) {
    const R = 6371000;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const aa = sinDLat * sinDLat +
      Math.cos(lat1) * Math.cos(lat2) *
      sinDLng * sinDLng;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  }
}
