// modules/osmPollutionProvider.js
import { OSMTrafficProvider } from "./osmTrafficProvider.js";
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMPollutionProvider {
  constructor(options = {}) {
    this.traffic = new OSMTrafficProvider({ apiKey: options.apiKey });
    this.osm = new OSMFeatureProvider();
  }

  async computePollution(bbox, lat, lng) {
    const traffic = await this.traffic.getTraffic(lat, lng);
    const industrial = await this.osm.getFeaturesByBBox(bbox, [
      "way[landuse=industrial]"
    ]);

    const speed = traffic?.flowSegmentData?.currentSpeed || 30;
    const industry = industrial.length;

    const score =
      Math.min(100,
        Math.round(
          (50 - speed) * 1.2 +
          industry * 3
        )
      );

    return Math.max(0, score);
  }
}
