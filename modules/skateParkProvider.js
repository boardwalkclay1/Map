import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class SkateParkProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getSkateParks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[leisure=skate_park]"
    ]);
  }

  async getRollerRinks(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[leisure=ice_rink]",
      "way[leisure=pitch][sport=roller_skating]"
    ]);
  }
}
