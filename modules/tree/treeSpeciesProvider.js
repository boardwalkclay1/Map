import { OSMGreenProvider } from "./osmGreenProvider.js";

export class TreeSpeciesProvider {
  constructor() {
    this.green = new OSMGreenProvider();
  }

  async getSpecies(bbox) {
    const trees = await this.green.getTrees(bbox);
    return trees.map(t => t.tags?.species || "unknown");
  }
}
