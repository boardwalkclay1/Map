// modules/osmBikeabilityProvider.js
import { OSMCyclingProvider } from "./osmCyclingProvider.js";
import { OSMSlopeProvider } from "./osmSlopeProvider.js";
import { OSMTrafficProvider } from "./osmTrafficProvider.js";

export class OSMBikeabilityProvider {
  constructor(options = {}) {
    this.cycling = new OSMCyclingProvider();
    this.slope = new OSMSlopeProvider();
    this.traffic = new OSMTrafficProvider({ apiKey: options.apiKey });
  }

  async computeBikeability(bbox, lat, lng) {
    const lanes = await this.cycling.getBikeLanes(bbox);
    const slopeGrid = await this.slope.generateSlopeGrid(bbox, 16);
    const traffic = await this.traffic.getTraffic(lat, lng);

    const slopeVal = Math.abs(slopeGrid[8][8] || 0);
    const trafficSpeed = traffic?.flowSegmentData?.currentSpeed || 0;

    const score =
      Math.min(100,
        Math.round(
          lanes.length * 0.8 +
          (30 - slopeVal) * 1.5 +
          (50 - trafficSpeed) * 0.5
        )
      );

    return score;
  }
}
