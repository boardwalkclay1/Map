// modules/osmKidFriendProvider.js
import { OSMLanduseProvider } from "./osmLanduseProvider.js";
import { OSMAmenityProvider } from "./osmAmenityProvider.js";
import { OSMHazardProvider } from "./osmHazardProvider.js";

export class OSMKidFriendProvider {
  constructor() {
    this.landuse = new OSMLanduseProvider();
    this.amenities = new OSMAmenityProvider();
    this.hazards = new OSMHazardProvider();
  }

  async computeKidFriendliness(bbox) {
    const parks = await this.landuse.getParks(bbox);
    const schools = await this.amenities.getSchools(bbox);
    const speedBumps = await this.hazards.getSpeedBumps(bbox);

    const crossings = await this.hazards.getCrosswalks(bbox);

    const score = Math.min(
      100,
      Math.round(
        parks.length * 2 +
        schools.length * 2 +
        speedBumps.length * 1.5 +
        crossings.length * 1
      )
    );

    return score;
  }
}
