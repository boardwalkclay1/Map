// src/core/layers.js
export class Layer {
  constructor(id, options = {}) {
    this.id = id;
    this.options = options;
  }

  attach(app) {
    this.app = app;
  }

  add() {}
  remove() {}
  update(data) {}
}

export class LayerManager {
  constructor(app) {
    this.app = app;
    this.layers = new Map();
  }

  addLayer(layer) {
    layer.attach(this.app);
    this.layers.set(layer.id, layer);
    layer.add();
    this.app.events.emit("layer:added", { id: layer.id });
  }

  removeLayer(id) {
    const layer = this.layers.get(id);
    if (!layer) return;
    layer.remove();
    this.layers.delete(id);
    this.app.events.emit("layer:removed", { id });
  }

  getLayer(id) {
    return this.layers.get(id);
  }
}
