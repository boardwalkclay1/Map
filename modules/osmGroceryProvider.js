// modules/osmGroceryProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMGroceryProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getGroceries(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[shop=supermarket]",
      "node[shop=convenience]"
    ]);
  }

  async getOrganicMarkets(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[shop=organic]"
    ]);
  }
}
