// Simple event bus so layers/plugins can talk without tight coupling
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).delete(handler);
  }

  emit(event, payload) {
    if (!this.listeners.has(event)) return;
    for (const handler of this.listeners.get(event)) {
      handler(payload);
    }
  }
}

// Base layer + manager

class Layer {
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

class LayerManager {
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

// Base plugin + manager

class Plugin {
  constructor(id, options = {}) {
    this.id = id;
    this.options = options;
  }

  attach(app) {
    this.app = app;
  }

  onInit() {}
  onMount() {}
  onUnmount() {}
}

class PluginManager {
  constructor(app) {
    this.app = app;
    this.plugins = new Map();
  }

  register(plugin) {
    plugin.attach(this.app);
    this.plugins.set(plugin.id, plugin);
    plugin.onInit();
    this.app.events.emit("plugin:registered", { id: plugin.id });
  }

  mount(id) {
    const plugin = this.plugins.get(id);
    if (!plugin) return;
    plugin.onMount();
    this.app.events.emit("plugin:mounted", { id });
  }

  unmount(id) {
    const plugin = this.plugins.get(id);
    if (!plugin) return;
    plugin.onUnmount();
    this.app.events.emit("plugin:unmounted", { id });
  }
}

// Core app shell

class App {
  constructor(mapContainerId = "map", uiContainerId = "ui") {
    this.mapContainer = document.getElementById(mapContainerId);
    this.uiContainer = document.getElementById(uiContainerId);

    this.events = new EventBus();
    this.layers = new LayerManager(this);
    this.plugins = new PluginManager(this);

    this._initMapSurface();
    this._initBaseUI();
  }

  // Placeholder: you can swap this with MapLibre / Leaflet / OpenLayers later
  _initMapSurface() {
    // For now, just a simple overlay to show it's alive
    const label = document.createElement("div");
    label.textContent = "Map surface ready – plug your engine in here.";
    label.style.position = "absolute";
    label.style.bottom = "12px";
    label.style.left = "12px";
    label.style.padding = "4px 8px";
    label.style.fontSize = "11px";
    label.style.borderRadius = "999px";
    label.style.background = "rgba(0,0,0,0.6)";
    label.style.color = "#fff";
    label.style.pointerEvents = "none";
    this.mapContainer.appendChild(label);

    // Expose a hook for your future map engine
    this.map = {
      container: this.mapContainer,
      // later: setCenter, setZoom, addSource, addLayer, etc.
    };
  }

  _initBaseUI() {
    this._addSystemPanel();
    this._wireToolbar();
  }

  _addSystemPanel() {
    const panels = document.getElementById("panels");

    const panel = document.createElement("section");
    panel.className = "panel";

    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">System</div>
        <span class="badge">Core</span>
      </div>
      <div class="panel-body">
        <div>Layers: <span id="layer-count">0</span></div>
        <div>Plugins: <span id="plugin-count">0</span></div>
      </div>
    `;

    panels.appendChild(panel);

    this.events.on("layer:added", () => this._updateCounts());
    this.events.on("layer:removed", () => this._updateCounts());
    this.events.on("plugin:registered", () => this._updateCounts());
  }

  _wireToolbar() {
    const toolbarButtons = document.getElementById("toolbar-buttons");

    const demoBtn = document.createElement("button");
    demoBtn.className = "button";
    demoBtn.textContent = "Add demo layer";
    demoBtn.onclick = () => this._addDemoLayer();

    const pluginBtn = document.createElement("button");
    pluginBtn.className = "button";
    pluginBtn.textContent = "Mount demo plugin";
    pluginBtn.onclick = () => this._mountDemoPlugin();

    toolbarButtons.appendChild(demoBtn);
    toolbarButtons.appendChild(pluginBtn);
  }

  _updateCounts() {
    const layerCount = document.getElementById("layer-count");
    const pluginCount = document.getElementById("plugin-count");
    layerCount.textContent = this.layers.layers.size;
    pluginCount.textContent = this.plugins.plugins.size;
  }

  // Demo layer & plugin to show how to extend

  _addDemoLayer() {
    if (this.layers.getLayer("demo-layer")) return;

    class DemoLayer extends Layer {
      add() {
        // Here is where you'd call your real map engine
        const marker = document.createElement("div");
        marker.textContent = "●";
        marker.style.position = "absolute";
        marker.style.top = "50%";
        marker.style.left = "50%";
        marker.style.transform = "translate(-50%, -50%)";
        marker.style.fontSize = "32px";
        marker.style.color = "#4da3ff";
        marker.dataset.layerId = this.id;
        this.app.map.container.appendChild(marker);
        this._el = marker;
      }

      remove() {
        if (this._el) {
          this._el.remove();
        }
      }
    }

    const layer = new DemoLayer("demo-layer");
    this.layers.addLayer(layer);
  }

  _mountDemoPlugin() {
    if (this.plugins.plugins.has("demo-plugin")) {
      this.plugins.mount("demo-plugin");
      return;
    }

    class DemoPlugin extends Plugin {
      onInit() {
        // Could register events, hotkeys, etc.
      }

      onMount() {
        const panels = document.getElementById("panels");
        const panel = document.createElement("section");
        panel.className = "panel";
        panel.id = "demo-plugin-panel";
        panel.innerHTML = `
          <div class="panel-header">
            <div class="panel-title">Demo Plugin</div>
            <span class="badge">Plugin</span>
          </div>
          <div class="panel-body">
            This panel was added by a plugin. Replace this with your own module UI.
          </div>
        `;
        panels.appendChild(panel);
      }

      onUnmount() {
        const panel = document.getElementById("demo-plugin-panel");
        if (panel) panel.remove();
      }
    }

    const plugin = new DemoPlugin("demo-plugin");
    this.plugins.register(plugin);
    this.plugins.mount("demo-plugin");
  }
}

// Boot

window.app = new App();
console.log("App ready. You can now layer more JS onto window.app.");
