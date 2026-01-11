// modules/osmHazardProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMHazardProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getCrosswalks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[highway=crossing]"
    ]);
  }

  async getSpeedBumps(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[traffic_calming=bump]",
      "node[traffic_calming=hump]"
    ]);
  }

  async getTrafficCalming(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[traffic_calming]"
    ]);
  }
}
