// modules/osmFireProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMFireProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getFireHydrants(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[emergency=fire_hydrant]"
    ]);
  }

  async getFireStations(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=fire_station]",
      "way[amenity=fire_station]"
    ]);
  }

  async getEmergencyAccessPoints(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[emergency=access_point]"
    ]);
  }
}
