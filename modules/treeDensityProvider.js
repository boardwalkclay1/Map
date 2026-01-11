import { OSMGreenProvider } from "./osmGreenProvider.js";

export class TreeDensityProvider {
  constructor() {
    this.green = new OSMGreenProvider();
  }

  async computeDensity(bbox) {
    const trees = await this.green.getTrees(bbox);
    return trees.length;
  }
}
