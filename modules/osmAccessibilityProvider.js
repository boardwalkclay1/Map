// modules/osmAccessibilityProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMAccessibilityProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getWheelchairAccessible(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[wheelchair=yes]",
      "way[wheelchair=yes]"
    ]);
  }

  async getRamps(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[ramp=yes]",
      "way[ramp=yes]"
    ]);
  }

  async getElevators(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[highway=elevator]"
    ]);
  }
}
