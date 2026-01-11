// modules/osmBuildingHeightProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMBuildingHeightProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getBuildingHeights(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[building][height]",
      "way[building][building:levels]"
    ]);
  }

  extractHeight(building) {
    const h = building.tags?.height;
    const levels = building.tags?.["building:levels"];

    if (h) return parseFloat(h);
    if (levels) return levels * 3; // approx 3m per level

    return null;
  }
}
