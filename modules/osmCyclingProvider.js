// modules/osmCyclingProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMCyclingProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getBikeLanes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway][cycleway]"
    ]);
  }

  async getBikeRoutes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=route][route=bicycle]'
    ]);
  }

  async getBikeParking(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=bicycle_parking]"
    ]);
  }
}
