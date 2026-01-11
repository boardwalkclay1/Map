// modules/radiusTool.js

export class RadiusTool {
  constructor(mapCore, markerEngine, popupEngine) {
    this.mapCore = mapCore;
    this.markerEngine = markerEngine;
    this.popupEngine = popupEngine;

    this.active = false;
    this.center = null;
    this.radiusMeters = 1000; // default 1km

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '23';
    document.getElementById('map').appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this._buildControl();
    this._attachEvents();
    this._resize();

    const origRender = this.mapCore.render.bind(this.mapCore);
    this.mapCore.render = () => {
      origRender();
      this.render();
    };

    window.addEventListener('resize', () => this._resize());
  }

  _buildControl() {
    this.control = document.createElement('div');
    this.control.style.position = 'absolute';
    this.control.style.left = '50%';
    this.control.style.bottom = '52px';
    this.control.style.transform = 'translateX(-50%)';
    this.control.style.padding = '6px 10px';
    this.control.style.borderRadius = '999px';
    this.control.style.background = 'rgba(15,23,42,0.95)';
    this.control.style.border = '1px solid rgba(148,163,184,0.5)';
    this.control.style.display = 'none';
    this.control.style.zIndex = '26';
    this.control.style.fontSize = '11px';
    this.control.style.color = '#e5e7eb';
    this.control.style.backdropFilter = 'blur(12px)';

    this.control.innerHTML =
      `<span style="margin-right:6px;">Radius:</span>
       <input type="range" min="100" max="5000" value="${this.radiusMeters}" step="100"
              style="width:160px;" />
       <span id="radius-label" style="margin-left:6px;">${(this.radiusMeters/1000).toFixed(1)} km</span>`;

    document.getElementById('app').appendChild(this.control);

    this.rangeInput = this.control.querySelector('input[type="range"]');
    this.radiusLabel = this.control.querySelector('#radius-label');

    this.rangeInput.addEventListener('input', () => {
      this.radiusMeters = parseFloat(this.rangeInput.value);
      this.radiusLabel.textContent =
        this.radiusMeters >= 1000
          ? `${(this.radiusMeters / 1000).toFixed(1)} km`
          : `${this.radiusMeters.toFixed(0)} m`;
      this.render();
    });
  }

  _attachEvents() {
    const mapEl = document.getElementById('map');
    mapEl.addEventListener('click', (e) => {
      if (!this.active) return;

      const rect = mapEl.getBoundingClientRect();
      const latLng = this.mapCore.getLatLngFromScreen(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
      this.center = latLng;
      this.render();
      this._updatePopup();
    });
  }

  enable() {
    this.active = true;
    this.control.style.display = 'flex';
  }

  disable() {
    this.active = false;
    this.control.style.display = 'none';
    this.center = null;
    this.render();
    this.popupEngine.closePopup('radius-tool');
  }

  toggle() {
    this.active ? this.disable() : this.enable();
  }

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);
    if (!this.active || !this.center) return;

    const tileSize = this.mapCore.tileSize;
    const zoom = this.mapCore.zoom;
    const scale = tileSize * Math.pow(2, zoom);

    const centerWorldMap = this._latLngToWorld(this.mapCore.center, scale);
    const centerWorldCircle = this._latLngToWorld(this.center, scale);

    const screenX = width / 2 + (centerWorldCircle.x - centerWorldMap.x);
    const screenY = height / 2 + (centerWorldCircle.y - centerWorldMap.y);
    const metersPerPixel = this._metersPerPixel(this.center.lat, zoom);
    const radiusPx = this.radiusMeters / metersPerPixel;

    ctx.beginPath();
    ctx.arc(screenX, screenY, radiusPx, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.fill();
  }

  _updatePopup() {
    const markers = this.markerEngine.markers || [];
    const inside = markers.filter(m => this._distance(this.center, m) <= this.radiusMeters);

    const html =
      `<div style="min-width:200px;max-width:260px;padding:8px 10px;
                  background:rgba(15,23,42,0.98);border-radius:10px;
                  border:1px solid rgba(247, 224, 138, 0.8);
                  box-shadow:0 16px 40px rgba(15,23,42,0.95);
                  font-size:12px;color:#e5e7eb;">
         <div style="font-weight:600;margin-bottom:4px;">Radius analysis</div>
         <div style="color:#facc15;font-size:11px;margin-bottom:4px;">
           Center: ${this.center.lat.toFixed(4)}, ${this.center.lng.toFixed(4)}
         </div>
         <div style="color:#9ca3af;font-size:11px;margin-bottom:6px;">
           Radius: ${this.radiusMeters >= 1000
                    ? (this.radiusMeters/1000).toFixed(1)+' km'
                    : this.radiusMeters.toFixed(0)+' m'}
         </div>
         <div style="font-size:11px;">
           <strong>${inside.length}</strong> marker(s) inside radius
         </div>
       </div>`;

    this.popupEngine.openPopup({
      id: 'radius-tool',
      lat: this.center.lat,
      lng: this.center.lng,
      html,
      anchor: 'top'
    });
  }

  _latLngToWorld(latLng, scale) {
    const worldX = (latLng.lng + 180) / 360;
    const sinLat = Math.sin(latLng.lat * Math.PI / 180);
    const worldY = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
    return { x: worldX * scale, y: worldY * scale };
  }

  _metersPerPixel(lat, zoom) {
    const earthCircumference = 40075016.686;
    const latRad = lat * Math.PI / 180;
    return earthCircumference * Math.cos(latRad) / Math.pow(2, zoom + 8);
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
