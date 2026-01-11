// modules/osmLightingProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMLightingProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getStreetLamps(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[highway=street_lamp]"
    ]);
  }

  async getLitRoads(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway][lit=yes]"
    ]);
  }

  async getUnlitRoads(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway][lit=no]"
    ]);
  }
}
