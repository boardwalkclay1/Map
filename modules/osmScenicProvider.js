// modules/osmScenicProvider.js
import { OSMTourismProvider } from "./osmTourismProvider.js";
import { OSMWaterProvider } from "./osmWaterProvider.js";
import { OSMGreenProvider } from "./osmGreenProvider.js";

export class OSMScenicProvider {
  constructor() {
    this.tourism = new OSMTourismProvider();
    this.water = new OSMWaterProvider();
    this.green = new OSMGreenProvider();
  }

  async computeScenic(bbox, lat, lng) {
    const viewpoints = await this.tourism.getViewpoints(bbox);
    const lakes = await this.water.getLakes(bbox);
    const trees = await this.green.getTrees(bbox);

    const vp = viewpoints.length * 5;
    const w = lakes.length * 4;
    const g = trees.length * 0.5;

    const scenic = Math.min(100, Math.round(vp + w + g));
    return scenic;
  }
}
