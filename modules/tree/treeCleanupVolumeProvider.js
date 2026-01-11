// modules/tree/treeCleanupVolumeProvider.js

import { OSMGreenProvider } from "../osmGreenProvider.js";

export class TreeCleanupVolumeProvider {
  constructor() {
    this.green = new OSMGreenProvider();
  }

  async estimateCleanupVolume(bbox) {
    const trees = await this.green.getTrees(bbox);

    let volume = 0;

    for (const t of trees) {
      const species = t.tags?.species || "unknown";

      if (species.includes("pine")) volume += 1.2;
      else if (species.includes("oak")) volume += 2.0;
      else if (species.includes("maple")) volume += 1.8;
      else volume += 1.5;
    }

    return Math.round(volume);
  }
}
