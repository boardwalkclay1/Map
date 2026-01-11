// modules/osmSeniorFriendProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";
import { OSMHazardProvider } from "./osmHazardProvider.js";
import { OSMSlopeProvider } from "./osmSlopeProvider.js";

export class OSMSeniorFriendProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
    this.hazards = new OSMHazardProvider();
    this.slope = new OSMSlopeProvider();
  }

  async computeSeniorFriendliness(bbox) {
    const benches = await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=bench]"
    ]);
    const crossings = await this.hazards.getCrosswalks(bbox);
    const slopeGrid = await this.slope.generateSlopeGrid(bbox, 16);
    const slopeVal = Math.abs(slopeGrid[8][8] || 0);

    const score = Math.min(
      100,
      Math.round(
        benches.length * 2 +
        crossings.length * 1.5 +
        (30 - slopeVal) * 1
      )
    );

    return score;
  }
}
