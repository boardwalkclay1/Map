// modules/osmPublicTransportProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMPublicTransportProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getStops(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[public_transport=platform]",
      "node[public_transport=stop_position]"
    ]);
  }

  async getStations(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[railway=station]",
      "way[railway=station]"
    ]);
  }
}
