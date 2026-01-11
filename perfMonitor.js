// modules/perfMonitor.js

export class PerfMonitor {
  constructor(mapCore, panelEl) {
    this.mapCore = mapCore;
    this.panelEl = panelEl;

    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;

    const origRender = this.mapCore.render.bind(this.mapCore);
    this.mapCore.render = () => {
      this._onFrame();
      origRender();
    };

    this._loop();
  }

  _onFrame() {
    this.frames++;
  }

  _loop() {
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 1000) {
      this.fps = (this.frames * 1000) / delta;
      this.frames = 0;
      this.lastTime = now;
      this._renderPanel();
    }

    requestAnimationFrame(() => this._loop());
  }

  _renderPanel() {
    this.panelEl.textContent =
      `FPS: ${this.fps.toFixed(1)} · Zoom: ${this.mapCore.zoom.toFixed(2)}`;
  }
}
