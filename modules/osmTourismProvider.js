// modules/osmTourismProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMTourismProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getAttractions(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[tourism=attraction]",
      "way[tourism=attraction]"
    ]);
  }

  async getViewpoints(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[tourism=viewpoint]"
    ]);
  }

  async getMuseums(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[tourism=museum]",
      "way[tourism=museum]"
    ]);
  }
}
