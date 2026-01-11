// modules/drawingEngine.js

export class DrawingEngine {
  constructor(mapCore, popupEngine) {
    this.mapCore = mapCore;
    this.popupEngine = popupEngine;

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '22';

    document.getElementById('map').appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.shapes = []; // { id, type: 'polyline'|'polygon'|'circle', points, radiusMeters? }
    this.currentShape = null;
    this.mode = 'idle'; // 'idle' | 'drawing-polyline' | 'drawing-polygon' | 'drawing-circle'

    window.addEventListener('resize', () => this._resize());
    this._resize();

    const origRender = this.mapCore.render.bind(this.mapCore);
    this.mapCore.render = () => {
      origRender();
      this.render();
    };

    this._attachEvents();
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'idle') {
      this.currentShape = null;
    }
  }

  startPolyline() {
    this.setMode('drawing-polyline');
    this.currentShape = {
      id: `polyline-${Date.now()}`,
      type: 'polyline',
      points: []
    };
  }

  startPolygon() {
    this.setMode('drawing-polygon');
    this.currentShape = {
      id: `polygon-${Date.now()}`,
      type: 'polygon',
      points: []
    };
  }

  startCircle() {
    this.setMode('drawing-circle');
    this.currentShape = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      center: null,
      radiusMeters: 0
    };
  }

  clearAll() {
    this.shapes = [];
    this.currentShape = null;
    this.mode = 'idle';
    this.render();
  }

  _attachEvents() {
    const mapEl = document.getElementById('map');

    mapEl.addEventListener('click', (e) => {
      if (this.mode === 'idle') return;

      const rect = mapEl.getBoundingClientRect();
      const latLng = this.mapCore.getLatLngFromScreen(
        e.clientX - rect.left,
        e.clientY - rect.top
      );

      if (this.mode === 'drawing-polyline' || this.mode === 'drawing-polygon') {
        this.currentShape.points.push(latLng);
      } else if (this.mode === 'drawing-circle') {
        if (!this.currentShape.center) {
          this.currentShape.center = latLng;
        } else {
          this.currentShape.radiusMeters = this._distance(this.currentShape.center, latLng);
          this.shapes.push(this.currentShape);
          this.currentShape = null;
          this.setMode('idle');
        }
      }

      this.render();
    });

    mapEl.addEventListener('dblclick', (e) => {
      if (this.mode === 'drawing-polyline' || this.mode === 'drawing-polygon') {
        if (this.currentShape && this.currentShape.points.length > 1) {
          this.shapes.push(this.currentShape);
        }
        this.currentShape = null;
        this.setMode('idle');
        this.render();
      }
    });
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
    if (!ctx) return;

    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const tileSize = this.mapCore.tileSize;
    const zoom = this.mapCore.zoom;
    const scale = tileSize * Math.pow(2, zoom);
    const centerWorld = this._latLngToWorld(this.mapCore.center, scale);

    const allShapes = [...this.shapes];
    if (this.currentShape) allShapes.push(this.currentShape);

    for (const shape of allShapes) {
      ctx.save();

      if (shape.type === 'circle') {
        if (!shape.center) continue;
        const centerWorldShape = this._latLngToWorld(shape.center, scale);
        const screenX = width / 2 + (centerWorldShape.x - centerWorld.x);
        const screenY = height / 2 + (centerWorldShape.y - centerWorld.y);
        const metersPerPixel = this._metersPerPixel(shape.center.lat, zoom);
        const radiusPx = shape.radiusMeters / metersPerPixel;

        ctx.beginPath();
        ctx.arc(screenX, screenY, radiusPx, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
        ctx.fill();
      } else if (shape.type === 'polyline' || shape.type === 'polygon') {
        if (!shape.points.length) continue;

        ctx.beginPath();
        shape.points.forEach((pt, idx) => {
          const w = this._latLngToWorld(pt, scale);
          const sx = width / 2 + (w.x - centerWorld.x);
          const sy = height / 2 + (w.y - centerWorld.y);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });

        ctx.strokeStyle = shape.type === 'polyline'
          ? 'rgba(45, 212, 191, 0.9)'
          : 'rgba(244, 114, 182, 0.9)';
        ctx.lineWidth = 2.2;
        ctx.setLineDash(shape.type === 'polyline' ? [6, 3] : []);
        ctx.stroke();

        if (shape.type === 'polygon') {
          ctx.closePath();
          ctx.fillStyle = 'rgba(244, 114, 182, 0.08)';
          ctx.fill();
        }
      }

      ctx.restore();
    }
  }

  _latLngToWorld(latLng, scale) {
    const worldX = (latLng.lng + 180) / 360;
    const sinLat = Math.sin(latLng.lat * Math.PI / 180);
    const worldY = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
    return { x: worldX * scale, y: worldY * scale };
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

  _metersPerPixel(lat, zoom) {
    const earthCircumference = 40075016.686;
    const latRad = lat * Math.PI / 180;
    return earthCircumference * Math.cos(latRad) / Math.pow(2, zoom + 8);
  }
}
