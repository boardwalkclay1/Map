// modules/osmPetFriendlyProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMPetFriendlyProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getDogParks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[leisure=dog_park]"
    ]);
  }

  async getPetStores(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[shop=pet]"
    ]);
  }

  async getVets(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=veterinary]"
    ]);
  }
}
