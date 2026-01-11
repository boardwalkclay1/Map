// modules/osmCafeProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMCafeProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getCafes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=cafe]"
    ]);
  }

  async getCoffeeShops(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=coffee_shop]"
    ]);
  }
}
