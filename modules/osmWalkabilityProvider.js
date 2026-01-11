// modules/osmWalkabilityProvider.js
import { OSMSidewalkProvider } from "./osmSidewalkProvider.js";
import { OSMHazardProvider } from "./osmHazardProvider.js";
import { OSMAmenityProvider } from "./osmAmenityProvider.js";

export class OSMWalkabilityProvider {
  constructor() {
    this.sidewalks = new OSMSidewalkProvider();
    this.hazards = new OSMHazardProvider();
    this.amenities = new OSMAmenityProvider();
  }

  async computeWalkability(bbox) {
    const sidewalks = await this.sidewalks.getSidewalks(bbox);
    const crossings = await this.hazards.getCrosswalks(bbox);
    const shops = await this.amenities.getShops(bbox);

    const score =
      Math.min(100,
        Math.round(
          sidewalks.length * 0.5 +
          crossings.length * 1.2 +
          shops.length * 0.3
        )
      );

    return score;
  }
}
