// modules/uiOverlay.js

export function initUIOverlay(ctx) {
  const { mapCore, markerEngine, storage, streetViewShell, coordsLabel } = ctx;

  const mapEl = document.getElementById('map');
  const resetBtn = document.getElementById('btn-reset');
  const statusBadge = document.getElementById('badge-status');

  // Map click -> add marker
  mapEl.addEventListener('click', (e) => {
    const rect = mapEl.getBoundingClientRect();
    const latLng = mapCore.getLatLngFromScreen(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    markerEngine.addMarker(latLng.lat, latLng.lng);
    setStatus('Marker added · state saved locally');
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    mapCore.resetToInitial();
    markerEngine.clearAll();
    storage.clearAll();
    streetViewShell.resetPegman();
    setStatus('Map reset · markers cleared');
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

  // Marker click hook
  markerEngine.onMarkerClick = (marker) => {
    setStatus(
      `Marker selected @ ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}`
    );
  };

  // Street view open hook (ready for later deep integration)
  streetViewShell.onStreetViewOpen = (latLng) => {
    setStatus(
      `Street view opened @ ${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`
    );
  };

  function setStatus(text) {
    statusBadge.textContent = text;
  }
}
