// modules/uiOverlay.js

export function initUIOverlay(ctx) {
  const {
    mapCore,
    markerEngine,
    storage,
    streetViewShell,
    coordsLabel,
    popupEngine,
    drawingEngine,
    radiusTool,
    layerManager,
    perfMonitor // currently not used directly, but wired in for future hooks
  } = ctx;

  const mapEl = document.getElementById('map');
  const resetBtn = document.getElementById('btn-reset');
  const statusBadge = document.getElementById('badge-status');
  const drawBtn = document.getElementById('btn-draw');
  const radiusBtn = document.getElementById('btn-radius');
  const layerBtn = document.getElementById('btn-layers');

  // Map click → add marker (only when not drawing and not using radius)
  mapEl.addEventListener('click', (e) => {
    if (drawingEngine.mode !== 'idle' || radiusTool.active) return;

    const rect = mapEl.getBoundingClientRect();
    const latLng = mapCore.getLatLngFromScreen(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    const marker = markerEngine.addMarker(latLng.lat, latLng.lng);
    setStatus('Marker added · state saved locally');

    popupEngine.openPopup({
      id: `marker-${marker.id}`,
      lat: marker.lat,
      lng: marker.lng,
      html:
        `<div style="min-width:160px;max-width:220px;padding:8px 10px;
                    background:rgba(15,23,42,0.98);border-radius:10px;
                    border:1px solid rgba(148,163,184,0.7);
                    box-shadow:0 16px 40px rgba(15,23,42,0.95);
                    font-size:12px;color:#e5e7eb;">
           <div style="font-weight:600;margin-bottom:4px;">New marker</div>
           <div style="color:#9ca3af;font-size:11px;">
             ${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)}
           </div>
         </div>`,
      anchor: 'top'
    });
  });

  // Reset everything
  resetBtn.addEventListener('click', () => {
    mapCore.resetToInitial();
    markerEngine.clearAll();
    storage.clearAll();
    streetViewShell.resetPegman();
    popupEngine.closeAll();
    drawingEngine.clearAll();
    radiusTool.disable();
    setStatus('Map reset · all overlays cleared');
  });

  // Draw button cycles: idle → polygon → polyline → idle
  drawBtn.addEventListener('click', () => {
    if (drawingEngine.mode === 'idle') {
      drawingEngine.startPolygon();
      setStatus('Drawing polygon: click to add points, double-click to finish');
    } else if (drawingEngine.mode === 'drawing-polygon') {
      drawingEngine.startPolyline();
      setStatus('Drawing polyline: click to add points, double-click to finish');
    } else {
      drawingEngine.setMode('idle');
      setStatus('Drawing off');
    }
  });

  // Radius tool toggle
  radiusBtn.addEventListener('click', () => {
    radiusTool.toggle();
    setStatus(
      radiusTool.active
        ? 'Radius tool enabled: click map to set center'
        : 'Radius tool disabled'
    );
  });

  // Layer panel toggle
  layerBtn.addEventListener('click', () => {
    layerManager.togglePanel();
  });

  // Coordinate label (center + cursor)
  mapEl.addEventListener('mousemove', (e) => {
    const rect = mapEl.getBoundingClientRect();
    const cursor = mapCore.getLatLngFromScreen(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    coordsLabel.textContent =
      `Center: ${mapCore.center.lat.toFixed(4)}, ${mapCore.center.lng.toFixed(4)} ` +
      `· Cursor: ${cursor.lat.toFixed(4)}, ${cursor.lng.toFixed(4)} · Zoom: ${mapCore.zoom.toFixed(2)}`;
  });

  // Marker engine popup integration (for marker click)
  popupEngine.attachToMarkerEngine(markerEngine);

  function setStatus(text) {
    statusBadge.textContent = text;
  }
}
