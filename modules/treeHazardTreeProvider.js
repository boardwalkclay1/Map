import { OSMGreenProvider } from "./osmGreenProvider.js";

export class TreeHazardTreeProvider {
  constructor() {
    this.green = new OSMGreenProvider();
  }

  async detectHazardTrees(bbox) {
    const trees = await this.green.getTrees(bbox);
    return trees.filter(t =>
      t.tags?.["lean"] === "yes" ||
      t.tags?.["condition"] === "poor"
    );
  }
}
