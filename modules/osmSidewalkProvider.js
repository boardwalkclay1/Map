// modules/osmSidewalkProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMSidewalkProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getSidewalks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[footway=sidewalk]"
    ]);
  }

  async getFootpaths(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway=footway]"
    ]);
  }

  async getPedestrianCrossings(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[highway=crossing]"
    ]);
  }
}
