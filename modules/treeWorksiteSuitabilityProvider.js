import { TreeDensityProvider } from "./treeDensityProvider.js";
import { TreeAccessProvider } from "./treeAccessProvider.js";
import { TreeDropZoneProvider } from "./treeDropZoneProvider.js";

export class TreeWorksiteSuitabilityProvider {
  constructor() {
    this.density = new TreeDensityProvider();
    this.access = new TreeAccessProvider();
    this.drop = new TreeDropZoneProvider();
  }

  async computeSuitability(bbox) {
    const d = await this.density.computeDensity(bbox);
    const a = await this.access.computeAccess(bbox);
    const z = await this.drop.getDropZones(bbox);

    return Math.min(100, d * 0.5 + a.length * 2 + z.length * 1);
  }
}
