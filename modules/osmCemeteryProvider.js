// modules/osmCemeteryProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMCemeteryProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getCemeteries(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[landuse=cemetery]"
    ]);
  }

  async getMemorials(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[memorial]"
    ]);
  }
}
