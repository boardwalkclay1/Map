// modules/tree/treeRiskAssessmentProvider.js

import { TreeHazardTreeProvider } from "./treeHazardTreeProvider.js";
import { TreePowerlineRiskProvider } from "./treePowerlineRiskProvider.js";
import { TreeStormDamageProvider } from "./treeStormDamageProvider.js";

export class TreeRiskAssessmentProvider {
  constructor() {
    this.hazard = new TreeHazardTreeProvider();
    this.power = new TreePowerlineRiskProvider();
    this.storm = new TreeStormDamageProvider();
  }

  async assessRisk(bbox, lat, lng) {
    const hazardTrees = await this.hazard.detectHazardTrees(bbox);
    const powerRisk = await this.power.computeRisk(bbox);
    const stormRisk = await this.storm.computeStormRisk(bbox, lat, lng);

    const risk =
      Math.min(
        100,
        hazardTrees.length * 10 +
        powerRisk * 0.5 +
        stormRisk * 0.7
      );

    let level = "Low";
    if (risk > 25) level = "Moderate";
    if (risk > 50) level = "High";
    if (risk > 75) level = "Extreme";

    return {
      hazardTrees,
      powerRisk,
      stormRisk,
      riskScore: Math.round(risk),
      riskLevel: level
    };
  }
}
