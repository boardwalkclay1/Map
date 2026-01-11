// modules/tree/treeCrewTimeEstimatorProvider.js

import { TreeDensityProvider } from "./treeDensityProvider.js";
import { TreeCleanupVolumeProvider } from "./treeCleanupVolumeProvider.js";
import { TreeEquipmentAccessProvider } from "./treeEquipmentAccessProvider.js";

export class TreeCrewTimeEstimatorProvider {
  constructor() {
    this.density = new TreeDensityProvider();
    this.cleanup = new TreeCleanupVolumeProvider();
    this.access = new TreeEquipmentAccessProvider();
  }

  async estimateCrewTime(bbox, crewSize = 3) {
    const density = await this.density.computeDensity(bbox);
    const volume = await this.cleanup.estimateCleanupVolume(bbox);
    const access = await this.access.computeEquipmentAccess(bbox);

    const accessPenalty = access.length === 0 ? 1.4 : 1.0;

    const hours =
      (density * 0.3 + volume * 0.5) * accessPenalty;

    const manHours = Math.round(hours * crewSize);

    return {
      density,
      volume,
      accessPenalty,
      crewSize,
      hours: Math.round(hours),
      manHours
    };
  }
}
