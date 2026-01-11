// modules/osmSpeedProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMSpeedProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getSpeedLimits(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[maxspeed]"
    ]);
  }

  async getRoadSpeeds(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway][maxspeed]"
    ]);
  }
}
