// modules/osmFitnessProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMFitnessProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getGyms(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[leisure=fitness_centre]"
    ]);
  }

  async getTracks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[leisure=track]"
    ]);
  }

  async getSportsFields(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[leisure=pitch]"
    ]);
  }
}
