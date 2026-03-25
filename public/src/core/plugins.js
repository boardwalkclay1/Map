// src/core/plugins.js
export class Plugin {
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

export class PluginManager {
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
