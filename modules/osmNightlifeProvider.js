// modules/osmNightlifeProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMNightlifeProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getBars(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=bar]"
    ]);
  }

  async getNightclubs(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=nightclub]"
    ]);
  }

  async getLateRestaurants(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=restaurant][opening_hours]"
    ]);
  }

  async nightlifeDensity(bbox) {
    const bars = await this.getBars(bbox);
    const clubs = await this.getNightclubs(bbox);
    const rest = await this.getLateRestaurants(bbox);

    return Math.min(100, Math.round(bars.length * 1.5 + clubs.length * 3 + rest.length));
  }
}
