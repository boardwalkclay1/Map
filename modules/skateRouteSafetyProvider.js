import { SkateSurfaceQualityProvider } from "./skateSurfaceQualityProvider.js";
import { SkateSlopeProvider } from "./skateSlopeProvider.js";
import { SkateHazardProvider } from "./skateHazardProvider.js";

export class SkateRouteSafetyProvider {
  constructor() {
    this.surface = new SkateSurfaceQualityProvider();
    this.slope = new SkateSlopeProvider();
    this.hazard = new SkateHazardProvider();
  }

  async computeSafety(bbox) {
    const hazards = await this.hazard.getSkateHazards(bbox);
    const slope = await this.slope.computeSkateSlope(bbox);

    const hazardScore = hazards.bumps.length * 5 + hazards.crossings.length * 2;
    const slopePenalty = slope === "dangerous" ? 40 : slope === "steep" ? 20 : 0;

    return Math.max(0, 100 - hazardScore - slopePenalty);
  }
}
