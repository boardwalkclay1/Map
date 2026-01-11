// modules/osmGreenProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMGreenProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getTrees(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[natural=tree]"
    ]);
  }

  async getGrass(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[landuse=grass]"
    ]);
  }

  async getNaturalAreas(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[natural=wood]",
      "way[natural=grassland]",
      "way[natural=scrub]"
    ]);
  }
}
