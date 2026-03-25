// src/app/App.js
import { EventBus } from "../core/EventBus.js";
import { Layer, LayerManager } from "../core/layers.js";
import { Plugin, PluginManager } from "../core/plugins.js";

export default class App {
  constructor(mapContainerId = "map", uiContainerId = "ui") {
    this.mapContainer = document.getElementById(mapContainerId);
    this.uiContainer = document.getElementById(uiContainerId);

    this.events = new EventBus();
    this.layers = new LayerManager(this);
    this.plugins = new PluginManager(this);

    this._initMapSurface();
    this._initBaseUI();
  }

  _initMapSurface() {
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

  _addDemoLayer() {
    if (this.layers.getLayer("demo-layer")) return;

    class DemoLayer extends Layer {
      add() {
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
      onInit() {}

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
