import { OSMTrafficProvider } from "./osmTrafficProvider.js";

export class SkateTrafficProvider {
  constructor(options = {}) {
    this.traffic = new OSMTrafficProvider({ apiKey: options.apiKey });
  }

  async computeTrafficDanger(lat, lng) {
    const t = await this.traffic.getTraffic(lat, lng);
    const speed = t?.flowSegmentData?.currentSpeed || 30;
    return Math.min(100, Math.max(0, (speed - 10) * 3));
  }
}
