// modules/layerManager.js

export class LayerManager {
  constructor(mapCore, markerEngine, drawingEngine, radiusTool, panelEl) {
    this.mapCore = mapCore;
    this.markerEngine = markerEngine;
    this.drawingEngine = drawingEngine;
    this.radiusTool = radiusTool;
    this.panelEl = panelEl;

    this.layers = [
      { id: 'tiles', label: 'Base tiles', enabled: true },
      { id: 'markers', label: 'Markers', enabled: true },
      { id: 'drawing', label: 'Drawing overlays', enabled: true },
      { id: 'radius', label: 'Radius tool', enabled: false }
    ];

    this._renderPanel();
  }

  _renderPanel() {
    this.panelEl.innerHTML = '<div style="margin-bottom:6px;font-weight:600;">Layers</div>';

    this.layers.forEach(layer => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.marginBottom = '4px';

      row.innerHTML =
        `<span>${layer.label}</span>
         <label style="font-size:11px;color:#9ca3af;">
           <input type="checkbox" ${layer.enabled ? 'checked' : ''} data-layer="${layer.id}" />
           <span style="margin-left:4px;">${layer.enabled ? 'On' : 'Off'}</span>
         </label>`;

      this.panelEl.appendChild(row);
    });

    this.panelEl.querySelectorAll('input[data-layer]').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.getAttribute('data-layer');
        const layer = this.layers.find(l => l.id === id);
        if (!layer) return;
        layer.enabled = input.checked;
        this._applyLayerState(id, layer.enabled);
        input.nextElementSibling.textContent = layer.enabled ? 'On' : 'Off';
      });
    });
  }

  togglePanel() {
    const visible = this.panelEl.style.display === 'block' || this.panelEl.style.display === '';
    this.panelEl.style.display = visible ? 'none' : 'block';
  }

  _applyLayerState(id, enabled) {
    if (id === 'markers') {
      this.markerEngine.layer.style.display = enabled ? '' : 'none';
    }
    if (id === 'drawing') {
      this.drawingEngine.canvas.style.display = enabled ? '' : 'none';
    }
    if (id === 'radius') {
      enabled ? this.radiusTool.enable() : this.radiusTool.disable();
    }
    if (id === 'tiles') {
      this.mapCore.tileLayer.style.opacity = enabled ? '1' : '0.15';
    }
  }
}
