// modules/osmBridgeDetailProvider.js
import { OSMBridgeProvider } from "./osmBridgeProvider.js";

export class OSMBridgeDetailProvider {
  constructor() {
    this.bridges = new OSMBridgeProvider();
  }

  extractDetails(bridge) {
    return {
      type: bridge.tags?.bridge || "unknown",
      material: bridge.tags?.material || "unknown",
      length: bridge.tags?.length || null
    };
  }
}
