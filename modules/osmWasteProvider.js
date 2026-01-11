// modules/osmWasteProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMWasteProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getTrashCans(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=waste_basket]"
    ]);
  }

  async getRecyclingPoints(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=recycling]"
    ]);
  }

  async getWasteDisposal(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=waste_disposal]"
    ]);
  }
}
