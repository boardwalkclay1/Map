// modules/osmAccessibilityScoreProvider.js
import { OSMAccessibilityProvider } from "./osmAccessibilityProvider.js";

export class OSMAccessibilityScoreProvider {
  constructor() {
    this.access = new OSMAccessibilityProvider();
  }

  async computeAccessibility(bbox) {
    const wc = await this.access.getWheelchairAccessible(bbox);
    const ramps = await this.access.getRamps(bbox);
    const elevators = await this.access.getElevators(bbox);

    const score =
      Math.min(100,
        Math.round(
          wc.length * 1.5 +
          ramps.length * 2 +
          elevators.length * 3
        )
      );

    return score;
  }
}
