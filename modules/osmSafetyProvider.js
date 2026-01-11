// modules/osmSafetyProvider.js
import { OSMLightingProvider } from "./osmLightingProvider.js";
import { OSMHazardProvider } from "./osmHazardProvider.js";
import { OSMAmenityProvider } from "./osmAmenityProvider.js";

export class OSMSafetyProvider {
  constructor() {
    this.lighting = new OSMLightingProvider();
    this.hazards = new OSMHazardProvider();
    this.amenities = new OSMAmenityProvider();
  }

  async computeSafety(bbox) {
    const lamps = await this.lighting.getStreetLamps(bbox);
    const crossings = await this.hazards.getCrosswalks(bbox);
    const shops = await this.amenities.getShops(bbox);

    const lampScore = Math.min(100, lamps.length * 2);
    const crossingScore = Math.min(100, crossings.length * 3);
    const activityScore = Math.min(100, shops.length * 1.5);

    const safety = Math.round((lampScore + crossingScore + activityScore) / 3);

    return {
      safety,
      lampScore,
      crossingScore,
      activityScore
    };
  }
}
