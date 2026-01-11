// modules/osmNoiseBarrierProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMNoiseBarrierProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getNoiseBarriers(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[barrier=wall]",
      "way[barrier=berm]"
    ]);
  }
}
