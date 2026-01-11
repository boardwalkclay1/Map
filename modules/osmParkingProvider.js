// modules/osmParkingProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMParkingProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getParkingLots(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=parking]",
      "way[amenity=parking]"
    ]);
  }

  async getParkingGarages(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=parking][parking=multi-storey]",
      "way[amenity=parking][parking=multi-storey]"
    ]);
  }

  async getStreetParking(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[parking:lane]"
    ]);
  }
}
