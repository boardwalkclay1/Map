// modules/osmUtilityProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMUtilityProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getPowerLines(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[power=line]"
    ]);
  }

  async getPowerPoles(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[power=pole]"
    ]);
  }

  async getPipelines(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[man_made=pipeline]"
    ]);
  }

  async getTelecomTowers(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[man_made=communications_tower]"
    ]);
  }
}
