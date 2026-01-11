// modules/osmRoadWidthProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMRoadWidthProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getRoadWidths(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway][lanes]",
      "way[highway][width]"
    ]);
  }

  extractWidth(road) {
    const width = road.tags?.width;
    const lanes = road.tags?.lanes;

    if (width) return parseFloat(width);
    if (lanes) return lanes * 3.2; // approx lane width

    return null;
  }
}
