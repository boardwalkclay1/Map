// modules/osmTransitProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMTransitProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getBusRoutes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=route][route=bus]'
    ]);
  }

  async getTrainRoutes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=route][route=train]'
    ]);
  }

  async getSubwayRoutes(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=route][route=subway]'
    ]);
  }
}
