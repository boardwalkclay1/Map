// modules/osmEVChargingProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMEVChargingProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getChargingStations(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=charging_station]"
    ]);
  }

  async getFastChargers(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=charging_station][charging_speed=fast]"
    ]);
  }
}
