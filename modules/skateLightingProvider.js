import { OSMLightingProvider } from "./osmLightingProvider.js";

export class SkateLightingProvider {
  constructor() {
    this.light = new OSMLightingProvider();
  }

  async computeNightSafety(bbox) {
    const lamps = await this.light.getStreetLamps(bbox);
    return Math.min(100, lamps.length * 2);
  }
}
