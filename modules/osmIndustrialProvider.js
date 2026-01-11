// modules/osmIndustrialProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMIndustrialProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getIndustrialAreas(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[landuse=industrial]"
    ]);
  }

  async getFactories(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[man_made=factory]"
    ]);
  }
}
