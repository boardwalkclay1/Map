// modules/osmEmergencyProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMEmergencyProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getPoliceStations(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=police]"
    ]);
  }

  async getAmbulanceStations(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=ambulance_station]"
    ]);
  }

  async getEmergencyPhones(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[emergency=phone]"
    ]);
  }
}
