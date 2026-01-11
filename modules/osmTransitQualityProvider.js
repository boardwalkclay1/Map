// modules/osmTransitQualityProvider.js
import { OSMPublicTransportationProvider } from "./osmPublicTransportationProvider.js";

export class OSMTransitQualityProvider {
  constructor() {
    this.transit = new OSMPublicTransportationProvider();
  }

  async getQualityScore(bbox) {
    const stops = await this.transit.getStops(bbox);
    if (!stops.length) return 0;

    let score = 0;

    for (const stop of stops) {
      if (stop.frequency) score += stop.frequency;
    }

    return score / stops.length;
  }
}
