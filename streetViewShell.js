// modules/streetViewShell.js

export class StreetViewShell {
  constructor(mapCore) {
    this.mapCore = mapCore;

    this.panel = document.getElementById('streetview-panel');
    this.pegman = document.getElementById('streetview-pegman');
    this.closeBtn = document.getElementById('streetview-close');
    this.toggleBtn = document.getElementById('btn-toggle-streetview');
    this.content = document.getElementById('streetview-content');

    this.isDraggingPegman = false;

    this._attachEvents();
  }

  _attachEvents() {
    this.toggleBtn.addEventListener('click', () => {
      this.panel.classList.toggle('active');
    });

    this.closeBtn.addEventListener('click', () => {
      this.panel.classList.remove('active');
    });

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
  }

  resetPegman() {
    this.pegman.style.left = '50%';
    this.pegman.style.top = '50%';
  }

  openAt(latLng) {
    this.panel.classList.add('active');
    this.content.innerHTML =
      `Street view placeholder at:<br>` +
      `<strong>${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}</strong><br>` +
      `<small>Attach real panoramas here (remote or local).</small>`;

    if (typeof this.onStreetViewOpen === 'function') {
      this.onStreetViewOpen(latLng);
    }
  }
}
