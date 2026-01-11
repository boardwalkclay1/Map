import { TreeDensityProvider } from "./treeDensityProvider.js";
import { TreePowerlineRiskProvider } from "./treePowerlineRiskProvider.js";
import { TreeEquipmentAccessProvider } from "./treeEquipmentAccessProvider.js";

export class TreeJobEstimatorProvider {
  constructor() {
    this.density = new TreeDensityProvider();
    this.power = new TreePowerlineRiskProvider();
    this.access = new TreeEquipmentAccessProvider();
  }

  async estimateJobDifficulty(bbox, lat, lng) {
    const d = await this.density.computeDensity(bbox);
    const p = await this.power.computeRisk(bbox);
    const a = await this.access.computeEquipmentAccess(bbox);

    return Math.min(100, d * 0.4 + p * 0.5 - a.length * 2);
  }
}
