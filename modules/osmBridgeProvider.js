// modules/osmBridgeProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMBridgeProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getBridges(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[bridge]"
    ]);
  }

  async getTunnels(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[tunnel]"
    ]);
  }

  async getOverpasses(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[bridge=viaduct]"
    ]);
  }
}
