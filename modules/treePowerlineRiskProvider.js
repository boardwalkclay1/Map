import { OSMUtilityProvider } from "./osmUtilityProvider.js";
import { OSMGreenProvider } from "./osmGreenProvider.js";

export class TreePowerlineRiskProvider {
  constructor() {
    this.util = new OSMUtilityProvider();
    this.green = new OSMGreenProvider();
  }

  async computeRisk(bbox) {
    const lines = await this.util.getPowerLines(bbox);
    const trees = await this.green.getTrees(bbox);

    let risk = 0;
    for (const t of trees) {
      for (const l of lines) {
        const d = Math.hypot(t.lat - l.lat, t.lon - l.lon);
        if (d < 0.0005) risk += 10;
      }
    }

    return Math.min(100, risk);
  }
}
