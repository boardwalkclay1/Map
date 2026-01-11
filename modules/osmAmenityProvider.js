// modules/osmAmenityProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMAmenityProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getRestaurants(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=restaurant]"
    ]);
  }

  async getShops(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[shop]"
    ]);
  }

  async getHospitals(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=hospital]"
    ]);
  }

  async getSchools(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=school]"
    ]);
  }
}
