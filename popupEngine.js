// modules/popupEngine.js

export class PopupEngine {
  constructor(mapCore) {
    this.mapCore = mapCore;
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.inset = '0';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '24';

    document.getElementById('map').appendChild(this.container);

    this.popups = [];
    window.addEventListener('resize', () => this.render());
  }

  openPopup({ id, lat, lng, html, anchor = 'bottom', sticky = true }) {
    const existing = this.popups.find(p => p.id === id);
    if (existing) {
      existing.lat = lat;
      existing.lng = lng;
      existing.html = html;
      existing.anchor = anchor;
      existing.sticky = sticky;
    } else {
      this.popups.push({ id, lat, lng, html, anchor, sticky });
    }
    this.render();
  }

  closePopup(id) {
    this.popups = this.popups.filter(p => p.id !== id);
    this.render();
  }

  closeAll() {
    this.popups = [];
    this.render();
  }

  attachToMarkerEngine(markerEngine) {
    markerEngine.onMarkerClick = (marker) => {
      const html =
        `<div style="min-width:160px;max-width:220px;padding:8px 10px;
                    background:rgba(15,23,42,0.98);border-radius:10px;
                    border:1px solid rgba(148,163,184,0.7);
                    box-shadow:0 16px 40px rgba(15,23,42,0.95);
                    font-size:12px;color:#e5e7eb;">
           <div style="font-weight:600;margin-bottom:4px;">Marker</div>
           <div style="color:#9ca3af;font-size:11px;">
             ${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)}
           </div>
           <div style="margin-top:6px;text-align:right;">
             <button data-popup-close="${marker.id}"
                     style="border:none;border-radius:999px;padding:3px 8px;
                            font-size:11px;background:#1d4ed8;color:#e5e7eb;cursor:pointer;">
               Close
             </button>
           </div>
         </div>`;

      this.openPopup({
        id: `marker-${marker.id}`,
        lat: marker.lat,
        lng: marker.lng,
        html,
        anchor: 'top'
      });

      this._wireDomesticClose();
    };
  }

  _wireDomesticClose() {
    this.container.querySelectorAll('[data-popup-close]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-popup-close');
        this.closePopup(`marker-${id}`);
      };
    });
  }

  render() {
    this.container.innerHTML = '';
    if (!this.popups.length) return;

    const rect = this.container.getBoundingClientRect();
    const width = rect.width || this.container.parentElement.clientWidth;
    const height = rect.height || this.container.parentElement.clientHeight;

    const tileSize = this.mapCore.tileSize;
    const zoom = this.mapCore.zoom;

    const scale = tileSize * Math.pow(2, zoom);
    const worldCenter = this._latLngToWorld(this.mapCore.center.lat, this.mapCore.center.lng, scale);

    for (const p of this.popups) {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.pointerEvents = 'auto';

      const world = this._latLngToWorld(p.lat, p.lng, scale);
      const screenX = width / 2 + (world.x - worldCenter.x);
      const screenY = height / 2 + (world.y - worldCenter.y);

      el.innerHTML = p.html;
      this.container.appendChild(el);

      const boxRect = el.getBoundingClientRect();
      let x = screenX - boxRect.width / 2;
      let y = screenY;

      if (p.anchor === 'top') y -= boxRect.height + 12;
      if (p.anchor === 'bottom') y += 12;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  }

  _latLngToWorld(lat, lng, scale) {
    const worldX = (lng + 180) / 360;
    const sinLat = Math.sin(lat * Math.PI / 180);
    const worldY = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
    return {
      x: worldX * scale,
      y: worldY * scale
    };
  }
}
