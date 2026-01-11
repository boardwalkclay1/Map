import { OSMRoadWidthProvider } from "./osmRoadWidthProvider.js";

export class TreeAccessProvider {
  constructor() {
    this.road = new OSMRoadWidthProvider();
  }

  async computeAccess(bbox) {
    const roads = await this.road.getRoadWidths(bbox);
    return roads.filter(r => this.road.extractWidth(r) >= 3); // chipper/truck width
  }
}
