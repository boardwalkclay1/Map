// modules/tree/treeJobCostEstimatorProvider.js

import { TreeJobEstimatorProvider } from "./treeJobEstimatorProvider.js";
import { TreeCleanupVolumeProvider } from "./treeCleanupVolumeProvider.js";
import { TreeEquipmentAccessProvider } from "./treeEquipmentAccessProvider.js";

export class TreeJobCostEstimatorProvider {
  constructor() {
    this.difficulty = new TreeJobEstimatorProvider();
    this.cleanup = new TreeCleanupVolumeProvider();
    this.access = new TreeEquipmentAccessProvider();
  }

  async estimateCost(bbox, lat, lng) {
    const diff = await this.difficulty.estimateJobDifficulty(bbox, lat, lng);
    const volume = await this.cleanup.estimateCleanupVolume(bbox);
    const access = await this.access.computeEquipmentAccess(bbox);

    const accessPenalty = access.length === 0 ? 1.3 : 1.0;

    const base = diff * 10 + volume * 5;
    const cost = Math.round(base * accessPenalty);

    return {
      difficulty: diff,
      cleanupVolume: volume,
      accessPenalty,
      estimatedCostUSD: cost
    };
  }
}
