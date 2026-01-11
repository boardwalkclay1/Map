// modules/osmAddressProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMAddressProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getAddresses(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[addr:housenumber]",
      "way[addr:housenumber]"
    ]);
  }

  async getStreetAddresses(bbox, streetName) {
    return await this.osm.getFeaturesByBBox(bbox, [
      `node[addr:street="${streetName}"]`,
      `way[addr:street="${streetName}"]`
    ]);
  }
}
