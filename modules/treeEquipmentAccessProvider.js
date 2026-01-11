import { OSMRoadWidthProvider } from "./osmRoadWidthProvider.js";

export class TreeEquipmentAccessProvider {
  constructor() {
    this.road = new OSMRoadWidthProvider();
  }

  async computeEquipmentAccess(bbox) {
    const roads = await this.road.getRoadWidths(bbox);
    return roads.filter(r => this.road.extractWidth(r) >= 3.5);
  }
}
