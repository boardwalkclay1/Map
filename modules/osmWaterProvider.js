// modules/osmWaterProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMWaterProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getRivers(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[waterway=river]",
      "way[waterway=stream]"
    ]);
  }

  async getLakes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[natural=water]",
      "way[water=lake]"
    ]);
  }

  async getCoastlines(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[natural=coastline]"
    ]);
  }
}
