// modules/osmCulturalProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMCulturalProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getTheaters(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=theatre]"
    ]);
  }

  async getGalleries(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[tourism=gallery]"
    ]);
  }

  async getLibraries(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=library]"
    ]);
  }
}
