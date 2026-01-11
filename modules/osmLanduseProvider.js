// modules/osmLanduseProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMLanduseProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getLanduse(bbox) {
    return await this.osm.getLanduse(bbox);
  }

  async getWater(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, ["way[water]","way[waterway]"]);
  }

  async getParks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, ["way[leisure=park]"]);
  }

  async getForests(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, ["way[landuse=forest]"]);
  }
}
