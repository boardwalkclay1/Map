// modules/osmMarinaProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMMarinaProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getMarinas(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[leisure=marina]"
    ]);
  }

  async getPiers(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[man_made=pier]"
    ]);
  }
}
